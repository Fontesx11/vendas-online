import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dtos/create-category.dto';
import { ProductService } from '../product/product.service';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CountProduct } from '../product/dtos/count-product.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,

         @Inject(forwardRef(() => ProductService))
        private readonly productService: ProductService,
    ){}

    findAmountCategoryInProducts(
        category: CategoryEntity,
        countList: CountProduct[],
    ): any {
        const count = countList.find(
            (itemCount) => itemCount.category_id === category.id,
        );

        if (count) {
            return count.total;
        }
    }

    async findAllCategories(): Promise<ReturnCategoryDto[]> {
        const categories = await this.categoryRepository.find();

        const count = await this.productService.countProductByCategoryId()
        console.log(count)
        if (!categories || categories.length === 0) {
            throw new NotFoundException('No categories found');
        }
        return categories.map((category)=> new ReturnCategoryDto(category, this.findAmountCategoryInProducts(category, count)));
    }

    async createCategory(createCategory: CreateCategory): Promise<CategoryEntity>{

        const category = await this.findCategoryByName(createCategory.name).catch(()=>undefined)

        if(category){
            throw new BadRequestException("Alredy registired")
        }

        return await this.categoryRepository.save(createCategory);
    }

    async findCategoryByName(name: string): Promise<CategoryEntity>{
        const category =  await this.categoryRepository.findOne({
            where:{
                name
            }
        })

        if(!category){
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    async findCategoryById(categoryId: number, isRelations?: boolean): Promise<CategoryEntity>{

        const relations = isRelations 
          ? {
                products: true
            } 
            : undefined

        const category =  await this.categoryRepository.findOne({
            where:{
                id: categoryId,
            },
            relations,
            
        })

        if(!category){
            throw new NotFoundException('Category Id NotFound');
        }
        
        return category;
    }

    async deleteCategoryById(categoryId: number): Promise<DeleteResult>{
        const category = await this.findCategoryById(categoryId, true);

        if (Array.isArray(category.products) && category.products.length > 0) {
            throw new BadRequestException('Category has products associeted')
        }

        return await this.categoryRepository.delete({id: categoryId})
    }
    
}

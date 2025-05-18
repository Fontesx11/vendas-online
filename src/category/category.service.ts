import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dtos/create-category.dto';
import { ProductService } from 'src/product/product.service';
import { ReturnCategoryDto } from './dtos/return-categorydto';
import { CountProduct } from 'src/product/dtos/count-product.dto';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
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

    async findCategoryById(categoryId: number): Promise<CategoryEntity>{
        const category =  await this.categoryRepository.findOne({
            where:{
                id: categoryId,
            }
        })

        if(!category){
            throw new NotFoundException('Category Id NotFound');
        }
        
        return category;
    }
    
}

import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ILike, In, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CountProduct } from './dtos/count-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @Inject(forwardRef(() => CategoryService))
        private readonly categoryService: CategoryService,
    ) {}

      async findAllPage(search?: string): Promise<ProductEntity[]> {
        let findOptions = {};

        if(search){
          findOptions = {
            where: {
              name: ILike(`%${search}%`),
            },
          };
        }

        const products = await this.productRepository.find(findOptions);

        if (!products || products.length === 0) {
          throw new NotFoundException('Not found products');
        }

        return products;
      }

    async findAll(productId?: number[], isRelation?: boolean): Promise<ProductEntity[]> {
      let findOptions = {};

      if (productId && productId.length > 0) {
        findOptions = {
          where: {
            id: In(productId),
          },
        };
      }

      if(isRelation){
        findOptions = {
          ...findOptions,
          relations :{
            category: true,
          }
        }
      }

      const products = await this.productRepository.find(findOptions);

      if (!products || products.length === 0) {
        throw new NotFoundException('Not found products');
      }

      return products;
    }

    async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity>{
        await this.categoryService.findCategoryById(createProductDto.categoryId)

        return await this.productRepository.save({...createProductDto})
    }

    async findProductById(productId: number, isRelations?: boolean): Promise<ProductEntity>{

      const relations =  isRelations ? {
          category:true,
        } : undefined


        const product = await this.productRepository.findOne({
            where:{
                id: productId
            },
          relations
        })
        if(!product){
            throw new NotFoundException('Product Id not found')
        }

        return product;
    }

    async deleteProduct(productId: number): Promise<DeleteResult> {
        await this.findProductById(productId);

        return this.productRepository.delete({id: productId});
    }

    async updateProduct(updateProduct: UpdateProductDto, productId: number): Promise<ProductEntity>{
        const product = await this.findProductById(productId)


        return await this.productRepository.save({
            ...product,
            ...updateProduct,
        })
    }

    async countProductByCategoryId(): Promise<CountProduct[]>{
      return this.productRepository
        .createQueryBuilder('product')
        .select('product.category_id, COUNT(*) as total')
        .groupBy('product.category_id')
        .getRawMany();
    }
}

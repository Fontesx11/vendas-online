import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        private readonly categoryService: CategoryService,
    ) {}

    async findAll(): Promise<ProductEntity[]>{
        const products = await this.productRepository.find();

        if(!products || products.length === 0){
            throw new NotFoundException("Product not Found")
        }

        return products;
    }

    async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity>{
        await this.categoryService.findCategoryById(createProductDto.categoryId)

        return await this.productRepository.save({...createProductDto})
    }

    async findProductById(productId: number): Promise<ProductEntity>{
        const product = await this.productRepository.findOne({
            where:{
                id: productId
            }
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
}

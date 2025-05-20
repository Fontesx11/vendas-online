import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { ReturnProductDto } from './dtos/return-product.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Roles(TypeUser.Admin, TypeUser.User)
@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) {}

    @Get()
    async findAll(): Promise<ReturnProductDto[]>{
        return (await this.productService.findAll([], true)).map((product)=> new ReturnProductDto(product)) 
    }

    @Roles(TypeUser.Admin , TypeUser.User)
    @UsePipes(ValidationPipe)
    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<ReturnProductDto>{
        return  this.productService.createProduct(createProductDto);
    }

    @Roles(TypeUser.Admin , TypeUser.User)
    @UsePipes(ValidationPipe)
    @Get('/:productId')
    async findProductByID(@Param('productId') productId: number): Promise<ReturnProductDto>{
        return new ReturnProductDto(await this.productService.findProductById(productId, true))
    }

    
    @Roles(TypeUser.Admin)
    @UsePipes(ValidationPipe)
    @Put('/:productId')
    async updateProduct(
        @Body() updateProduct: UpdateProductDto, 
        @Param('productId') productId: number,
    ): Promise<ProductEntity>{
        return  this.productService.updateProduct(updateProduct, productId);
    }

    @Roles(TypeUser.Admin)
    @UsePipes(ValidationPipe)
    @Delete('/:productId')
    async deleteProduct(@Param('productId') productId: number): Promise<DeleteResult>{
        return  this.productService.deleteProduct(productId);
    }
}

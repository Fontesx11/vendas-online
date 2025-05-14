import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { TypeUser } from 'src/user/enum/user-type.enum';
import { ReturnProductDto } from './dtos/return-product.dto';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';

@Roles(TypeUser.Admin, TypeUser.User)
@Controller('product')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
    ) {}

    @Get()
    async findAll(): Promise<ReturnProductDto[]>{
        return (await this.productService.findAll()).map((product)=> new ReturnProductDto(product)) 
    }

    @Roles(TypeUser.Admin)
    @UsePipes(ValidationPipe)
    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<ReturnProductDto>{
        return  this.productService.createProduct(createProductDto);
    }
}

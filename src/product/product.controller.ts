import { Controller, Get, Post } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { TypeUser } from 'src/user/enum/user-type.enum';
import { ReturnProductDto } from './dtos/create-product.dto';
import { ProductService } from './product.service';

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
}

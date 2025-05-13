import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { ReturnCategoryDto } from './dtos/return-categorydto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorator';
import { TypeUser } from 'src/user/enum/user-type.enum';

@Roles(TypeUser.Admin, TypeUser.User)
@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @UsePipes(ValidationPipe)
    @Get()
    async findAllCategories(): Promise<ReturnCategoryDto[]> {
        return ((await this.categoryService.findAllCategories()).map((category)=> new ReturnCategoryDto(category)))
    }
}

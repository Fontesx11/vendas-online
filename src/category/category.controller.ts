import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { ReturnCategoryDto } from './dtos/return-categorydto';
import { CategoryService } from './category.service';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { CreateCategory } from './dtos/create-category.dto';

@Roles(TypeUser.Admin, TypeUser.User)
@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get()
    async findAllCategories(): Promise<ReturnCategoryDto[]> {
        return ((await this.categoryService.findAllCategories()).map((category)=> new ReturnCategoryDto(category)))
    }

    @Roles(TypeUser.User, TypeUser.Admin)
    @UsePipes(ValidationPipe)
    @Post()
    async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
        return this.categoryService.createCategory(createCategory);
    }
}

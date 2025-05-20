import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { CreateCategory } from './dtos/create-category.dto';
import { DeleteResult } from 'typeorm';

@Roles(TypeUser.Admin, TypeUser.User)
@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get()
    async findAllCategories(): Promise<ReturnCategoryDto[]> {
        return this.categoryService.findAllCategories()
    }

    @Roles(TypeUser.User, TypeUser.Admin)
    @UsePipes(ValidationPipe)
    @Post()
    async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
        return this.categoryService.createCategory(createCategory);
    }

    @Roles(TypeUser.User, TypeUser.Admin)
    @Delete('/:categoryId')
    async deleteCategoryById(@Param('categoryId') categoryId: number): Promise<DeleteResult> {
        return this.categoryService.deleteCategoryById(categoryId);
    }
}

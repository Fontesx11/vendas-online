import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { ReturnCategoryDto } from './dtos/return-category.dto';
import { CategoryService } from './category.service';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { CreateCategory } from './dtos/create-category.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCategoryDto } from './dtos/update-category.dto';


@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get()
    async findAllCategories(): Promise<ReturnCategoryDto[]> {
        return this.categoryService.findAllCategories()
    }

    @Get('/:categoryId')
    async findCategoryById(@Param('categoryId') categoryId: number): Promise<ReturnCategoryDto> {
        return this.categoryService.findCategoryById(categoryId, true)
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

    @UsePipes(ValidationPipe)
    @Put('/:categoryId')
    async updateCategoryById(@Body() updateCategoryDto: UpdateCategoryDto, @Param('categoryId') categoryId: number): Promise<ReturnCategoryDto> {
        return new ReturnCategoryDto(await this.categoryService.updateCategoryById(categoryId, updateCategoryDto))
    }
}

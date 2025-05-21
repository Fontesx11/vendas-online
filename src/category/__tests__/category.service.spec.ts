import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/create-category.mock';
import { ProductService } from '../../product/product.service';
import { countProductMock } from '../../product/__mocks__/count-product.mock';
import { ReturnCategoryDto } from '../dtos/return-category.dto';
import { productMock } from '../../product/__mocks__/product.mock';
import { BadRequestException } from '@nestjs/common';
import { returnDeleteMock } from '../../__mocks__/return-deleted.mock';
import { updateCategoryMock } from '../__mocks__/update-category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService,
        {
          provide: ProductService,
          useValue: {
            countProductByCategoryId: jest
              .fn()
              .mockResolvedValue([countProductMock]),
          },
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue:{
            find: jest.fn().mockResolvedValue([categoryMock]),
            save: jest.fn().mockResolvedValue(categoryMock),
            findOne: jest.fn().mockResolvedValue(categoryMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        }
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return list category', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([
      new ReturnCategoryDto(categoryMock, countProductMock.total),
    ]);
  });

  it('should return error in list category empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce([]);

    expect(service.findAllCategories()).rejects.toThrow();
  });

  it('should return error in list category exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

    expect(service.findAllCategories()).rejects.toThrow();
  });

  it('should return error if exist category', async () => {

    expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });

  it('should return category after save', async () => {

    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);
    const category = await service.createCategory(createCategoryMock);

    expect(category).toEqual(categoryMock);
  });

  it('should return error in exception', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValue(new Error());

    expect(service.createCategory(createCategoryMock)).rejects.toThrow();
  });

  it('should return category in findByName', async () => {
    const category = await service.findCategoryByName(categoryMock.name);

    expect(category).toEqual(categoryMock);
  });

  it('should return error if category find by name empty', async () => {
     jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);


    expect(service.findCategoryByName(categoryMock.name)).rejects.toThrow();
  });

  it('should return error if category alredy exist', async () => {
     jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

    expect(service.findCategoryByName(categoryMock.name)).rejects.toThrow();
  });

   it('should return category in findById', async () => {
    const category = await service.findCategoryById(categoryMock.id);

    expect(category).toEqual(categoryMock);
  });

   it('should return error if category id not found', async () => {
     jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

    expect(service.findCategoryById(categoryMock.id)).rejects.toThrow();
  });

   it('should return delete result in success', async () => {
    const deleteResult = await service.deleteCategoryById(categoryMock.id);

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should send relations in request findOne', async () => {
    const spy = jest.spyOn(categoryRepository, 'findOne');
    await service.deleteCategoryById(categoryMock.id);

    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: categoryMock.id,
      },
      relations: {
        products: true,
      },
    });
  });

  it('should send new category to save', async () => {
    const spy = jest.spyOn(categoryRepository, 'save')
    await service.updateCategoryById(categoryMock.id, updateCategoryMock)


    expect(spy.mock.calls[0][0]).toEqual({
      ...categoryMock,
      ...updateCategoryMock,
    });
  });

  it('should return error new category to save', async () => {
    const spy = jest.spyOn(categoryRepository, 'findOne')
    const category = await service.updateCategoryById(categoryMock.id, updateCategoryMock)

    expect(category).toEqual(categoryMock);
    expect(spy.mock.calls.length > 0).toEqual(true);
  });

  it('should return error if category with relations', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue({
      ...categoryMock,
      products: [productMock],
    });

    expect(service.deleteCategoryById(categoryMock.id)).rejects.toThrow(
      BadRequestException,
    );
  });


});

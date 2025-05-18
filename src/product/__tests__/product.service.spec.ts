import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { In, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../__mocks__/product.mock';
import { CreateProductDto } from '../dtos/create-product.dto';
import { createProductMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../__mocks__/delete-product.mock';
import { updateProductMock } from '../__mocks__/update-product.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([productMock]),
            save: jest.fn().mockResolvedValue(productMock),
            findOne: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          }
        },
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryMock),
          },
        }
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    categoryService = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await service.findAll();
    
    expect(products).toEqual([productMock])
  });

  it('should return error if products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValue([]);

    expect(service.findAll()).rejects.toThrow();
  });

  it('should return error in exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValue(new Error())

    expect(service.findAll()).rejects.toThrow();
  });

  it('should return all products', async () => {
    const products = await service.createProduct(createProductMock);
    
    expect(products).toEqual(productMock)
  });

  it('should return product after insert in DB', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockRejectedValue(new Error());

    expect(service.createProduct(createProductMock)).rejects.toThrow();
  });

  it('should return product in findById', async () => {
    const products = await service.findProductById(productMock.id);
    
    expect(products).toEqual(productMock)
  });

   it('should return error in product not found', async () => {
    jest
      .spyOn(productRepository, 'findOne')
      .mockRejectedValue(new Error());

    expect(service.findProductById(productMock.id)).rejects.toThrow();
  });

  it('should return deleted true in deleted product', async () => {
    const deleted = await service.deleteProduct(productMock.id);
    
    expect(deleted).toEqual(returnDeleteMock);
  });

  it('should return product in update product', async () => {
    const productUpdated = await service.updateProduct(updateProductMock,productMock.id);
    
    expect(productUpdated).toEqual(productMock);
  });

  it('should return error in update product', async () => {
    jest
      .spyOn(productRepository, 'save')
      .mockRejectedValue(new Error());

    expect(service.updateProduct(updateProductMock,productMock.id)).rejects.toThrow();
  });

   it('should return relations in find all products', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAll([], true);

    expect(products).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      relations: {
        category: true,
      },
    });
  });

  it('should return relatiosn and array in find all products', async () => {
    const spy = jest.spyOn(productRepository, 'find');
    const products = await service.findAll([1], true);

    expect(products).toEqual([productMock]);
    expect(spy.mock.calls[0][0]).toEqual({
      where: {
        id: In([1]),
      },
      relations: {
        category: true,
      },
    });
  });

});

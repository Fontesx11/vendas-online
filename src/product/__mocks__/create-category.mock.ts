import { CreateProductDto } from "../dtos/create-product.dto";
import { ProductEntity } from "../entities/product.entity";

export const createProductMock: CreateProductDto = {
    categoryId: 123,
    image: 'http://',
    name: "soccorro",
    price: 22,
}
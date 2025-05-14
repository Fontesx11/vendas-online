import { categoryMock } from "../../category/__mocks__/category.mock";
import { CreateProductDto } from "../dtos/create-product.dto";

export const updateProductMock: CreateProductDto = {
    categoryId: categoryMock.id,
    image: 'http://muitamassa',
    name: "do balaco baco",
    price: 42.0,
}
import { CategoryEntity } from "../entities/category.entity";

export class ReturnCategoryDto {
    id: number;
    name: string;
    amountProducst?: number;

    constructor(categoryEntity: CategoryEntity, amountProducts?: number) {
        this.id = categoryEntity.id;
        this.name = categoryEntity.name;
        this.amountProducst = amountProducts;
    }

}
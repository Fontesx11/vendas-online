import { CartProductEntity } from "../../cart-product/entities/cart-product.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'cart'})
export class CartEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({name: 'user_id', nullable: false})
    userId: number;

    @Column({name: 'active', nullable: false})
    active: boolean;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @UpdateDateColumn({name: 'created_at'})
    createdAt: Date;

    @OneToMany(()=> CartProductEntity,
       (cartProduct) => cartProduct.cart,
      )
    cartProduct?: CartProductEntity[];
}
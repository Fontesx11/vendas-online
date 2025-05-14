import { Column, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CartEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({name: 'user_id', nullable: false})
    userId: number;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @UpdateDateColumn({name: 'created_at'})
    createdAt: Date;
}
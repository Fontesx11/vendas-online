import { OrderEntity } from "src/order/entities/order.entity";
import { AddressEntity } from "../../address/entities/address.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'user'})
export class UserEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({name: 'name', nullable: false})
  name: string;

  @Column({name: 'email', nullable: false})
  email:string;

  @Column({name: 'phone'})
  phone: string;

  @Column({name: 'cpf', nullable: false})
  cpf: string;

  @Column({name: 'password', nullable: false})
  password: string;

  @Column({name: 'type_user', nullable: false})
  typeUser: number;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

  @UpdateDateColumn({name: 'created_at'})
  createdAt: Date;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses?: AddressEntity[];

  @OneToMany(() => OrderEntity, (order) => order.address)
  orders?: OrderEntity[];
  
}
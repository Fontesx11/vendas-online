import {
  ChildEntity,
  Column,
  TableInheritance,
} from 'typeorm';
import { PaymentEntity } from './payment.entity';

@ChildEntity()
export abstract class PaymentPixEntity extends PaymentEntity{

  @Column({ name: 'code', nullable: false })
  code: number;

  @Column({ name: 'data_payment', nullable: false })
  dataPayment: Date;
}
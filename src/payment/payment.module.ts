import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentEntity } from './entities/payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}

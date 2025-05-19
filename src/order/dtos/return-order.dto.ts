import { ReturnAddressDto } from "src/address/dto/returnAddress.dto";
import { ReturnUserDto } from "../../user/dto/returnUser.dto";
import { OrderEntity } from '../entities/order.entity';
import { OrderProductEntity } from "src/order-product/entities/oder-product.entity";
import { ReturnPaymentDTO } from "src/payment/dtos/return-payment.dto";
import { ReturnOrderProductDTO } from "src/order-product/dtos/return-order-product.dto";

export class ReturnOrderDTO {
  id: number;
  date: string;
  userId: number;
  addressId: number;
  paymentId: number;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDTO;
  ordersProduct?: ReturnOrderProductDTO[];
  amountProducts?: number;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDto(order.address)
      : undefined;
    this.payment = order.payment
      ? new ReturnPaymentDTO(order.payment)
      : undefined;
     this.ordersProduct = order.ordersProduct
      ? order.ordersProduct.map(
          (orderProduct) => new ReturnOrderProductDTO(orderProduct),
        )
      : undefined;
      this.amountProducts = order.amountProducts;
  }
}
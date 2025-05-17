import { PaymentCreditCartEntity } from "../entities/payment-credit-cart.entity";
import { paymentMock } from './payment.mock';

export const paymentCreditCardMock: PaymentCreditCartEntity = {
  ...paymentMock,
  amountPayments: 54,
};
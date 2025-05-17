import { addressMock } from "../../address/__Mock__/address.mock";
import { CreateOrderDto } from "../dtos/create-order.dto";
import { paymentCreditCardMock } from "../../payment/__mocks__/payment-credit-card.mock";
import { paymentPixMock } from "../../payment/__mocks__/payment-pix.mock";

export const createOrderPixMock: CreateOrderDto ={ 
    addressId: addressMock.id,
    codePix: paymentPixMock.code,
    datePayment: '2020-01-01',
}

export const createOrderCreditCardMock: CreateOrderDto ={ 
    addressId: addressMock.id,
    amountPayments: paymentCreditCardMock.amountPayments,
}
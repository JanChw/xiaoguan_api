import { PaymentStatus } from '../enums/order.enum'
import { CartItem } from './cartItem.interface'

export interface Order {
  id: number;

  code: string;

  status?: PaymentStatus;

  products: CartItem[];

  totalQty: number;

  totalPrice: number;

  userId: number;
}

export interface OrderQuery {
  code?: string;

  status?: PaymentStatus;

  page?: string | number;

  size?: string | number;

  orderby?: string
}

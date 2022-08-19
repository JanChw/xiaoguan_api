import { PaymentStatus } from '../enums/order.enum'
import { CartItem } from './cartItem.interface'

export interface Order {
  code: string;

  status?: PaymentStatus;

  products: CartItem[];

  totalQty: number;

  totalPrice: number;

  userId: number;
}

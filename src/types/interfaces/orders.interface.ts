import { PaymentStatus } from '../enums/orders.enum'
import { CartItem } from './cartItems.interface'

export interface Order {
  code: string;

  status?: PaymentStatus;

  products: CartItem[];

  totalQty: number;

  totalPrice: number;

  userId: number;
}

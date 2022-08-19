import { CartItem } from '@/types/interfaces/cartItem.interface'
export interface Cart{
  id: number;
  userId:number;
  cartItems?: CartItem[];
  totalQty?: number;
  totalPrice?: number;
}

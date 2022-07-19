import { CartItem } from '@/types/interfaces/cartItems.interface'
export interface Cart{
  id: number;
  userId:number;
  cartItems?: CartItem[];
  totalQty?: number;
  totalPrice?: number;
}

import { IsDecimal, IsInt, IsOptional } from 'class-validator'
import { CartItem } from '../interfaces/cartItems.interface'

export class CartDto {
  @IsInt()
  userId: Number

  @IsOptional()
  cartItems: CartItem[]

  @IsInt()
  @IsOptional()
  totalQty: Number

  @IsDecimal()
  @IsOptional()
  totalPrice: Number
}

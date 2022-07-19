import { IsDecimal, isIn, IsInt } from 'class-validator'

export class CartItemDto {
  @IsDecimal()
  price: Number

  @IsInt()
  qty: Number

  @IsInt()
  specId: Number

  @IsInt()
  cartId: number
}

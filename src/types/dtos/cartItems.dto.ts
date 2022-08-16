import { IsNumber, IsInt, IsDecimal } from 'class-validator'

export class CartItemDto {
  @IsNumber()
  price: number

  @IsInt()
  qty: number

  @IsInt()
  specId: number

  @IsInt()
  cartId: number
}

export class CartQtyDto {
  @IsInt()
  id: number

  @IsInt()
  qty: number
}

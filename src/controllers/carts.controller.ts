import { Body, Controller, Delete, Get, Param, Put } from 'routing-controllers'
import { CartService } from '@/services/carts.service'

import { OpenAPI } from 'routing-controllers-openapi'
import { Cart } from '@/types/interfaces/carts.interface'
import { CartItemDto } from '@/types/dtos/cartItems.dto'

@Controller()
export class CartsController {
  public cartService = new CartService()

  @Get('/cart/:userId')
  @OpenAPI({ summary: 'get a cart' })
  async getCartByUserId (@Param('userId') userId: number) {
    const cart: Cart = await this.cartService.getOneOrCreate(userId)
    return { data: cart, message: 'get a cart ' }
  }

  @Put('/cart/:userId/add')
  @OpenAPI({ summary: 'clear  cart' })
  async clearCart (@Param('userId') userId: number) {
    const cart: Cart = await this.cartService.clearCart(userId)
    return { data: cart, message: 'clear cart' }
  }

  @Put('/cart/:userId/remove')
  @OpenAPI({ summary: 'add item to cart' })
  async addItemToCart (@Param('userId') userId: number, @Body() item: CartItemDto) {
    const cart: Cart = await this.cartService.addItemToCart(item, userId)
    return cart
  }

  @Delete('/cart/:userId')
  @OpenAPI({ summary: 'Delete item or item from cart' })
  async removeItemsFromCart (@Body() ids: number[], @Param('userId') userId: number) {
    const cart: Cart = await this.cartService.removeItemsFromCart(ids, userId)
    return cart
  }
}

import { Body, BodyParam, Controller, Delete, Get, Param, Put, UseBefore } from 'routing-controllers'
import { CartService } from '@/services/carts.service'

import { OpenAPI } from 'routing-controllers-openapi'
import { Cart } from '@/types/interfaces/carts.interface'
import { CartItemDto, CartQtyDto } from '@/types/dtos/cartItems.dto'
import { validationMiddleware } from '@/middlewares/validation.middleware'

@Controller()
export class CartsController {
  public cartService = new CartService()

  @Get('/user/:userId/cart')
  @OpenAPI({ summary: 'get or creat a cart' })
  async getCartByUserId (@Param('userId') userId: number) {
    const cart: Cart = await this.cartService.getOneOrCreate(userId)
    return { data: cart, message: 'get a cart ' }
  }

  @Put('/user/:userId/cart/clear')
  @OpenAPI({ summary: 'clear cart' })
  async clearCart (@Param('userId') userId: number) {
    const cart: Cart = await this.cartService.clearCart(userId)
    return { data: cart, message: 'clear cart' }
  }

  @Put('/user/:userId/cart/add')
  @OpenAPI({ summary: 'add item to cart' })
  @UseBefore(validationMiddleware(CartItemDto, 'body'))
  async addItemToCart (@Param('userId') userId: number, @Body() item: CartItemDto) {
    const cart: Cart = await this.cartService.addItemToCart(item, userId)
    return cart
  }

  @Put('/user/:userId/cart/item/qty')
  @OpenAPI({ summary: 'update item qty' })
  @UseBefore(validationMiddleware(CartQtyDto, 'body'))
  async updateCartItemQty (@Body() item: CartQtyDto, @Param('userId') userId: number) {
    const data: Cart = await this.cartService.updateItemQty(item, userId)
    return { data, message: 'update item qty' }
  }

  @Delete('/user/:userId/cart/remove')
  @OpenAPI({ summary: 'Delete item or item from cart' })
  async removeItemsFromCart (@BodyParam('ids') ids: number[], @Param('userId') userId: number) {
    console.log(ids)
    console.log(userId)
    const cart: Cart = await this.cartService.removeItemsFromCart(ids, userId)
    return cart
  }
}

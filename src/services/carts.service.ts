import { Cart } from '@/types/interfaces/carts.interface'
import db from '@/db'
import { CartItemDto } from '@/types/dtos/cartItems.dto'

export class CartService {
  async getOneOrCreate (userId: number): Promise<Cart> {
    const cart: Cart = await db.cart.findUnique({ where: { userId } })
    if (cart) return cart
    const _cart: Cart = await db.cart.create({ data: { userId } })
    return _cart
  }

  async getOne (userId: number): Promise<Cart> {
    return await db.cart.findUnique({ where: { userId } })
  }

  async clearCart (userId: number): Promise<Cart> {
    const cart: Cart = await db.cart.update({
      where: { userId },
      data: {
        totalQty: 0,
        totalPrice: 0,
        cartItems: []
      }
    })
    return cart
  }

  async addItemToCart (item: CartItemDto, userId: number) {
    await db.cartItem.create({ data: item })
    const cart: Cart = await this.getOne(userId)
    return cart
  }

  async removeItemsFromCart (itemIds: number[], userId: number) {
    await db.cartItem.deleteMany({ where: { id: { in: itemIds } } })
    const cart: Cart = await this.getOne(userId)
    return cart
  }
}

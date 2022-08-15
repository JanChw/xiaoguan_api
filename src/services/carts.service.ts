import { Cart } from '@/types/interfaces/carts.interface'
import db from '@/db'

import { CartItemDto, CartQtyDto } from '@/types/dtos/cartItems.dto'

export class CartService {
  async getOneOrCreate (userId: number): Promise<Cart> {
    const cart: Cart = await db.cart.findUnique({ where: { userId }, include: { cartItems: true } })
    if (cart) return cart
    const _cart: Cart = await db.cart.create({ data: { userId }, include: { cartItems: true } })
    return _cart
  }

  // TODO: user -> cart 一对一的关系
  async getOne (userId: number): Promise<Cart> {
    return await db.cart.findUnique({ where: { userId }, include: { cartItems: true } })
  }

  async clearCart (userId: number): Promise<Cart> {
    const _cart:Cart = await db.cart.findFirst({ where: { userId } })
    const cart: Cart = await db.cart.update({
      where: { userId },
      data: {
        totalQty: 0,
        totalPrice: 0,
        cartItems: {
          deleteMany: {
            cartId: _cart.id
          }
        }
      }
    })
    return cart
  }

  async addItemToCart (item: CartItemDto, userId: number) {
    const { specId, cartId, ...data } = item
    data.spec = { connect: { id: specId } }
    data.cart = { connect: { id: cartId } }
    await db.cartItem.create({ data })
    const cart: Cart = await this.getOne(userId)
    return cart
  }

  async updateItemQty (itemObj: CartQtyDto, userId: number) {
    const { id, qty } = itemObj
    await db.cartItem.update({ where: { id }, data: { qty } })
    const cart: Cart = await this.getOne(userId)
    return cart
  }

  async removeItemsFromCart (itemIds: number[], userId: number) {
    await db.cartItem.deleteMany({ where: { id: { in: itemIds } } })
    const cart: Cart = await this.getOne(userId)
    return cart
  }
}

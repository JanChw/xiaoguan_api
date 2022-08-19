import { Cart } from '@/types/interfaces/cart.interface'
import db from '@/db'
import { CartItemDto, CartQtyDto } from '@/types/dtos/cartItem.dto'
import { ItemStatus } from '@/types/enums/cartItem.enum'

export class CartService {
  public select = {
    id: true,
    userId: true,
    cartItems: {
      where:
      { itemStatus: ItemStatus.IN_CART }
    }
  }

  async getOneOrCreate (userId: number): Promise<Cart> {
    const cart: Cart = await db.cart.findUnique({
      where: { userId },
      select: this.select
    })
    if (cart) return cart
    const _cart: Cart = await db.cart.create({ data: { userId }, include: { cartItems: true } })
    return _cart
  }

  // TODO: user -> cart 一对一的关系
  async getOne (userId: number): Promise<Cart> {
    return await db.cart.findUnique({ where: { userId }, select: this.select })
  }

  async clearCart (userId: number): Promise<Cart> {
    const cart: Cart = await db.cart.update({
      where: { userId },
      data: {
        cartItems: {
          deleteMany: {
            itemStatus: ItemStatus.IN_CART
          }
        }
      },
      select: this.select
    })
    return cart
  }

  async addItemToCart (item: Partial<CartItemDto>, userId: number) {
    // const { specId, cartId, ...data } = item
    const cart: Cart = await db.cart.update({
      where: { userId },
      data: {
        cartItems: {
          create: item
        }
      },
      select: this.select
    })
    return cart
  }

  async updateItemQty (itemObj: CartQtyDto, userId: number) {
    const { id, qty } = itemObj

    const cart: Cart = await db.cart.update({
      where: { userId },
      data: {
        cartItems: {
          update: {
            where: { id }, data: { qty }
          }
        }
      },
      select: this.select
    })
    return cart
  }

  async removeItemsFromCart (itemIds: number[], userId: number) {
    const cart: Cart = await db.cart.update({
      where: { userId },
      data: {
        cartItems: {
          deleteMany: {
            id: { in: itemIds }
          }
        }
      },
      select: this.select
    })
    return cart
  }
}

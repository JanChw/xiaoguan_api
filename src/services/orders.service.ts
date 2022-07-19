import db from '@/db'
import { Cart } from '@/types/interfaces/carts.interface'
import { Order } from '@/types/interfaces/orders.interface'
import { CartService } from './carts.service'
@CRUD('order')
export class OrderService {
  public cartServer = new CartService()
  async createOrder (userId: number, token) {
    const cart: Cart = await this.cartServer.getOne(userId)
    if (!cart.cartItems.length) throw new HttpError(400, '购物车为空')
    const order: Order = await db.order.create({
      data: {
        code: token,
        products: cart.cartItems,
        totalQty: cart.totalQty,
        totalPrice: cart.totalPrice,
        userId: cart.userId
      }
    })
    return order
  }

  async getAllOrderByUserId (userId: number) {
    const orders: Order[] = await db.order.findMany({ where: { userId } })
    return orders
  }
}

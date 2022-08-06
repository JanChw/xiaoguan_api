import db from '@/db'
import { Cart } from '@/types/interfaces/carts.interface'
import { Order } from '@/types/interfaces/orders.interface'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
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

  public async search (content: string): Promise<Order[]> {
    if (isEmpty(content)) throw new HttpError(400, '参数不能为空')

    const data: Order[] = await db.order.findMany({
      where: {
        code: {
          search: content
        },
        status: {
          search: content
        }
      }
    })

    return data
  }

  async getAllOrderByUserId (userId: number) {
    const orders: Order[] = await db.order.findMany({ where: { userId } })
    return orders
  }
}

import db from '@/db'
import CRUD from '@/decorators/crud.decorator'
import { Cart } from '@/types/interfaces/cart.interface'
import { Order } from '@/types/interfaces/order.interface'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
import { CartService } from './cart.service'
import { ItemStatus } from '@/types/enums/cartItem.enum'
import { Decimal } from '@prisma/client/runtime'

@CRUD('order')
export class OrderService {
  public cartServer = new CartService()

  async createOrder (userId: number, code) {
    const { cartItems }: Cart = await this.cartServer.getOne(userId)
    if (!cartItems.length) throw new HttpError(400, '购物车为空')

    // const totalQty = cartItems.reduce((pre, current) => Decimal.add(pre, current.qty).toNumber(), 0)
    const totalPrice = cartItems.reduce((pre, { qty, price }) => Decimal.add(pre, Decimal.mul(qty, price)).toNumber(), 0)
    const totalQty = cartItems.reduce((pre, current) => pre + current.qty, 0)
    // const totalPrice = cartItems.reduce((pre, { qty, price }) => pre + qty * price, 0)
    const orderPms = db.order.create({
      data: {
        code,
        totalQty,
        totalPrice,
        userId,
        products: {
          connect: cartItems.map(item => ({ id: item.id }))
        }
      },
      include: { products: true }
    })
    const cartPms = db.cart.update({
      where: { userId },
      data: {
        cartItems: {
          updateMany: {
            where: {},
            data: {
              itemStatus: ItemStatus.IN_ORDER
            }
          }
        }
      },
      include: { cartItems: true }
    })

    const [, order] = await db.$transaction([cartPms, orderPms])

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
    const orders: Order[] = await db.order.findMany({ where: { userId }, include: { products: true } })
    return orders
  }
}

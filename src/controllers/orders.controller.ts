import { order } from './../../node_modules/.pnpm/@prisma+client@4.0.0_prisma@4.0.0/node_modules/.prisma/client/index.d'
import { Body, BodyParam, Controller, Delete, Get, Param, Post } from 'routing-controllers'
import randomStr from 'randomstring'
import { OrderService } from '@/services/orders.service'
import { Order } from '@/types/interfaces/orders.interface'
import { OpenAPI } from 'routing-controllers-openapi'
@Controller()
export class OrdersController {
  public orderService = new OrderService()
  async generateOrderCode (): Promise<string> {
    return randomStr.generate({ length: 18, charset: 'numeric' })
  }

  @Post('/orders')
  @OpenAPI({ summary: 'create a order' })
  async createOrder (userId: number, @BodyParam('token') token: string) {
    const order: Order = await this.orderService.createOrder(userId, token)
    return { data: order, message: 'create order' }
  }

  @Get('/orders/:userId')
  @OpenAPI({ summary: 'get a list of orders' })
  async getAllOrderByUserId (@Param('userId') userId: number) {
    const orders: Order[] = await this.orderService.getAllOrderByUserId(userId)
    return orders
  }

  @Delete('/orders')
  @OpenAPI({ summary: 'delete a list of orders' })
  async removeOrders (@Body() ids: number[]): Promise<Order[]> {
    const orders: Order[] = await this.orderService.deletes(ids)
    return orders
  }
}

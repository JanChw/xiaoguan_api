import { Body, BodyParam, Controller, Delete, Get, Param, Post, QueryParam } from 'routing-controllers'
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

  @Get('/orders/search')
  @OpenAPI({ summary: 'fulltext' })
  async searchFullText (@QueryParam('content') content: string) {
    const data: Order[] = content
      ? await this.orderService.search(content)
      : await this.orderService.getAll({
        where: {
          isDeleted: false
        },
        include: { specs: true }
      })

    return { data, message: 'search' }
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

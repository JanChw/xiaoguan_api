import { Body, BodyParam, Controller, CurrentUser, Delete, Get, Param, Post, QueryParam } from 'routing-controllers'
import randomStr from 'randomstring'
import { OrderService } from '@/services/orders.service'
import { Order } from '@/types/interfaces/orders.interface'
import { OpenAPI } from 'routing-controllers-openapi'
import { User } from '@/types/interfaces/users.interface'

@Controller()
export class OrdersController {
  public orderService = new OrderService()

  @Get('/orders/generate/code')
  @OpenAPI({ summary: 'generate a code for order' })
  async generateOrderCode () {
    const data = randomStr.generate({ length: 19, charset: 'numeric' })
    return { data, message: 'get a random code' }
  }

  @Post('/orders')
  @OpenAPI({ summary: 'create a order' })
  async createOrder (@CurrentUser() user: User, @BodyParam('code') code: string) {
    const order: Order = await this.orderService.createOrder(user.id, code)
    return { data: order, message: 'create order' }
  }

  @Get('/orders/search')
  @OpenAPI({ summary: 'fulltext' })
  async searchFullText (@QueryParam('content') content: string) {
    const data: Order[] = content
      ? await this.orderService.search(content)
      : await this.orderService.getAll({ include: { specs: true } })

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

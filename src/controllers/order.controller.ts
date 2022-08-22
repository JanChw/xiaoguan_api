import { BodyParam, Controller, CurrentUser, Delete, Get, Param, Post, QueryParam, QueryParams, UseBefore } from 'routing-controllers'
import randomStr from 'randomstring'
import { OrderService } from '@/services/order.service'
import { Order } from '@/types/interfaces/order.interface'
import { OpenAPI } from 'routing-controllers-openapi'
import { User } from '@/types/interfaces/user.interface'
import { validationMiddleware } from '@/middlewares/validation.middleware'
import { OrderQueryDto } from '@/types/dtos/order.dto'

@Controller()
export class OrdersController {
  public orderService = new OrderService()

  @Get('/order/generate/code')
  @OpenAPI({ summary: 'generate a code for order' })
  async generateOrderCode () {
    const data = randomStr.generate({ length: 19, charset: 'numeric' })
    return { data, message: 'get a random code' }
  }

  @Post('/order')
  @OpenAPI({ summary: 'create a order' })
  async createOrder (@CurrentUser() user: User, @BodyParam('code') code: string) {
    const order: Order = await this.orderService.createOrder(user.id, code)
    // 过期未支付自动删除订单
    setTimeout(() => {
      this.orderService.delete(order.id)
    }, 30 * 60 * 1000)
    return { data: order, message: 'create order' }
  }

  @Get('/orders/search')
  @OpenAPI({ summary: 'search' })
  // @UseBefore(validationMiddleware(OrderQueryDto, 'query', true))
  async searchFullText (@QueryParams() query: OrderQueryDto) {
    const data = await this.orderService.search(query)
    return { data, message: 'search' }
  }

  @Get('/order/:userId')
  @OpenAPI({ summary: 'get a list of orders' })
  async getAllOrderByUserId (@Param('userId') userId: number) {
    const orders: Order[] = await this.orderService.getAllOrderByUserId(userId)
    return orders
  }

  @Delete('/orders')
  @OpenAPI({ summary: 'delete a list of orders' })
  async removeOrders (@BodyParam('ids') ids: number[]): Promise<Order[]> {
    const orders: Order[] = await this.orderService.deletes(ids)
    return orders
  }
}

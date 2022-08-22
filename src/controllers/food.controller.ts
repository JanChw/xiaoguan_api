import { Controller, Param, Body, Get, Post, Put, Delete, UseBefore, QueryParam, BodyParam, QueryParams, Authorized } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { BatchUpdateFoodsDto, FoodDto, FoodQueryDto } from '@/types/dtos/food.dto'
import { Food } from '@/types/interfaces/food.interface'
import FoodService from '@/services/food.service'
import { validationMiddleware } from '@middlewares/validation.middleware'
import { AddPermssion } from '@/decorators/permission.decorator'
import { ResultWithCount } from '@/types/interfaces/common.interface'

@Controller()
export class FoodController {
  public foodService = new FoodService();

  @Get('/foods')
  @OpenAPI({ summary: 'Return a list of foods' })
  // @AddPermssion('食品列表', 'food:finds')
  async getFoods (@QueryParams() queryData: FoodQueryDto) {
    const { isDeleted, ...paginationAndOrderBy } = queryData
    const data: ResultWithCount = await this.foodService.getAllWithPagination(paginationAndOrderBy)({
      where: { isDeleted }
    })
    return { data, message: 'findAll' }
  }

  @Get('/foods/search')
  @OpenAPI({ summary: 'fulltext' })
  async searchFullText (@QueryParams() queryData: FoodQueryDto) {
    const { content, ..._queryData } = queryData
    if (content) {
      const data = await this.foodService.search(content, _queryData)
      return { data, message: 'search' }
    }

    const data = await this.foodService.getAll({
      where: { isDeleted: false }
    })
    return { data, message: 'search' }
  }

  @Get('/food/:id')
  @OpenAPI({ summary: 'Return find a food' })
  @AddPermssion('查找商品', 'food:find')
  @Authorized('food:find')
  async getFoodById (@Param('id') id: number) {
    const food: Food = await this.foodService.getOneById(id, {
      include: { specs: true }
    })
    return { data: food, message: 'findOne' }
  }

  @Post('/food')
  @UseBefore(validationMiddleware(FoodDto, 'body'))
  @OpenAPI({ summary: 'Create a new Food' })
  @AddPermssion('创建食品', 'food:create')
  @Authorized('food:create')
  async createUser (@Body() foodData: FoodDto) {
    const food: Food = await this.foodService.createFood(foodData)
    return { data: food, message: 'created' }
  }

  @Put('/foods')
  @UseBefore(validationMiddleware(BatchUpdateFoodsDto, 'body'))
  @OpenAPI({ summary: 'Update a food' })
  @AddPermssion('批量更新食品', 'food:updates')
  @Authorized('food:updates')
  async updateFoods (@Body() batchUpdateFoods: BatchUpdateFoodsDto) {
    const { ids, payload } = batchUpdateFoods
    const foods: Food[] = await this.foodService.updates(ids, payload)
    return { data: foods, message: 'updated' }
  }

  @Put('/food/:id')
  @UseBefore(validationMiddleware(FoodDto, 'body', true))
  @OpenAPI({ summary: 'Update a food' })
  @AddPermssion('更新食品', 'food:update')
  @Authorized('food:update')
  async updateFood (@Param('id') id: number, @Body() foodData: Partial<FoodDto>) {
    const food: Food = await this.foodService.update(id, foodData)
    console.log(foodData)
    return { data: food, message: 'updated' }
  }

  @Delete('/food/:id')
  @AddPermssion('删除食品', 'food:delete')
  @OpenAPI({ summary: 'Delete a food' })
  async deleteFood (@Param('id') id: number) {
    // const deleteFoodData: Food[] = await this.foodService.deleteFood(foodId)
    const food: Food = await this.foodService.delete(id)
    return { data: food, message: 'deleted' }
  }

  @Delete('/foods')
  @OpenAPI({ summary: 'Delete some foods' })
  @AddPermssion('批量删除食品', 'food:deletes')
  async deleteFoods (@BodyParam('ids') ids: number[]) {
    const food: Food = await this.foodService.deletes(ids)
    return { data: food, message: 'deleted' }
  }
}

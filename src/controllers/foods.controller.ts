import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { CreateFoodDto } from '@/types/dtos/foods.dto'
import { Food } from '@/types/interfaces/foods.interface'
import FoodService from '@services/foods.service'
import { validationMiddleware } from '@middlewares/validation.middleware'

@Controller()
export class FoodsController {
  public foodService = new FoodService();

  @Get('/foods')
  @OpenAPI({ summary: 'Return a list of foods' })
  async getFoods () {
    // const findAllFoods: Food[] = await this.foodService.findAllFoods()
    const foods: Food[] = await this.foodService.getAll({
      include: { specs: true }
    })
    return { data: foods, message: 'findAll' }
  }

  @Get('/foods/:id')
  @OpenAPI({ summary: 'Return find a food' })
  async getFoodById (@Param('id') id: number) {
    // const food: Food = await this.foodService.findFoodById(foodId)
    const food: Food = await this.foodService.getOneById(id, {
      include: { specs: true }
    })
    return { data: food, message: 'findOne' }
  }

  @Post('/foods')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateFoodDto, 'body'))
  @OpenAPI({ summary: 'Create a new Food' })
  async createUser (@Body() foodData: CreateFoodDto) {
    const food: Food = await this.foodService.createFood(foodData)
    return { data: food, message: 'created' }
  }

  @Put('/foods/:id')
  @UseBefore(validationMiddleware(CreateFoodDto, 'body', true))
  @OpenAPI({ summary: 'Update a food' })
  async updateFood (@Param('id') id: number, @Body() foodData: Partial<CreateFoodDto>) {
    const food: Food = await this.foodService.update(id, foodData)
    return { data: food, message: 'updated' }
  }

  @Delete('/foods/:id')
  @OpenAPI({ summary: 'Delete a food' })
  async deleteFood (@Param('id') id: number) {
    // const deleteFoodData: Food[] = await this.foodService.deleteFood(foodId)
    const food: Food = await this.foodService.delete(id)
    return { data: food, message: 'deleted' }
  }
}

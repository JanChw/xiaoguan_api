import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { CreateFoodDto, UpdateFoodPartialDto } from '@/shared/dtos/foods.dto'
import { Food } from '@/shared/interfaces/foods.interface'
import FoodService from '@services/foods.service'
import { validationMiddleware } from '@middlewares/validation.middleware'

@Controller()
export class FoodsController {
  public foodService = new FoodService();

  @Get('/foods')
  @OpenAPI({ summary: 'Return a list of foods' })
  async getFoods () {
    const findAllFoods: Food[] = await this.foodService.findAllFoods()
    return { data: findAllFoods, message: 'findAll' }
  }

  @Get('/foods/:id')
  @OpenAPI({ summary: 'Return find a food' })
  async getFoodById (@Param('id') foodId: number) {
    const food: Food = await this.foodService.findFoodById(foodId)
    return { data: food, message: 'findOne' }
  }

  @Post('/foods')
  @HttpCode(201)
  @UseBefore(validationMiddleware(CreateFoodDto, 'body'))
  @OpenAPI({ summary: 'Create a new user' })
  async createUser (@Body() food: CreateFoodDto) {
    const createFoodData: Food = await this.foodService.createFood(food)
    return { data: createFoodData, message: 'created' }
  }

  @Put('/foods/:id')
  @UseBefore(validationMiddleware(UpdateFoodPartialDto, 'body', true))
  @OpenAPI({ summary: 'Update a food' })
  async updateFood (@Param('id') foodId: number, @Body() foodData: UpdateFoodPartialDto) {
    console.log('=======================')
    console.log(foodData)
    const updateFoodData: Food[] = await this.foodService.updateFood(foodId, foodData)
    return { data: updateFoodData, message: 'updated' }
  }

  @Delete('/foods/:id')
  @OpenAPI({ summary: 'Delete a food' })
  async deleteFood (@Param('id') foodId: number) {
    const deleteFoodData: Food[] = await this.foodService.deleteFood(foodId)
    return { data: deleteFoodData, message: 'deleted' }
  }
}

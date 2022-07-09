import db from '../db'
import { HttpException } from '@exceptions/HttpException'
import { Food } from '../shared/interfaces/foods.interface'
import { CreateFoodDto, UpdateFoodPartialDto } from '@/shared/dtos/foods.dto'
import { isEmpty } from '@utils/util'

export default class FoodService {
  public async findAllFoods () :Promise<Food[]> {
    const foods: Food[] = await db.food.findMany({
      include: { specs: true }
    })
    return foods
  }

  public async findFoodById (foodId: number): Promise<Food> {
    const food: Food = await db.food.findFirst({
      where: { id: foodId },
      include: { specs: true }
    })
    if (!food) throw new HttpException(409, 'the food not exists')

    return food
  }

  public async createFood (foodData: CreateFoodDto): Promise<Food> {
    if (isEmpty(foodData)) throw new HttpException(400, "You're not userData")

    const food: Food = await db.food.findFirst({ where: { name: foodData.name } })
    if (food) throw new HttpException(409, `Your ${foodData.name} already exists`)

    const { specs, ..._foodData } = foodData
    const _foodDataWithSpecs = Object.assign(_foodData, { specs: { create: specs } })
    const data = (!specs || !specs.length) ? _foodData : _foodDataWithSpecs

    const createFoodData: Food = await db.food.create({ data })

    return createFoodData
  }

  public async updateFood (foodId: number, foodData: UpdateFoodPartialDto): Promise<Food[]> {
    if (isEmpty(foodData)) throw new HttpException(400, "You're not foodData")

    const food: Food = await db.food.findUnique({ where: { id: foodId } })
    if (!food) throw new HttpException(409, "You're not user")
    console.log(Object.assign(food, foodData))
    const updateFoodData: Food[] = await db.food.update({
      where: { id: foodId },
      data: Object.assign(food, foodData)
    })

    return updateFoodData
  }

  public async deleteFood (foodId: number): Promise<Food[]> {
    const food: Food = await db.food.findFirst({ where: { id: foodId } })
    if (!food) throw new HttpException(409, "You're not user")

    const deleteFoodData: Food[] = await db.user.delete({ where: { id: foodId } })
    return deleteFoodData
  }
}

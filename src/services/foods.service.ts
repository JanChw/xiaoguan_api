import db from '../db'
import { HttpException } from '@exceptions/HttpException'
import { Food } from '../types/interfaces/foods.interface'
import { CreateFoodDto } from '@/types/dtos/foods.dto'
import { isEmpty } from '@utils/util'
import CRUD from '@/decorators/crud.decorator'

@CRUD('food')
export default class FoodService {
  // TODO: create函数能否显示关联数据
  public async createFood (foodData: CreateFoodDto): Promise<Food> {
    if (isEmpty(foodData)) throw new HttpException(400, "You're not userData")

    const food: Food = await db.food.findFirst({ where: { name: foodData.name } })
    if (food) throw new HttpException(409, `Your ${foodData.name} already exists`)

    const { specs, ..._foodData } = foodData
    const _foodDataWithSpecs = Object.assign(_foodData, { specs: { create: specs } })
    const data = (!specs || !specs.length) ? _foodData : _foodDataWithSpecs

    const _food: Food = await db.food.create({ data })

    return _food
  }
}

import db from '../db'
// import { HttpException } from '@exceptions/HttpException'
import { Food } from '../types/interfaces/foods.interface'
import { FoodDto } from '@/types/dtos/foods.dto'
import { isEmpty } from '@utils/util'
import CRUD from '@/decorators/crud.decorator'
import { HttpError } from 'routing-controllers'

@CRUD('food')
export default class FoodService {
  // TODO: create函数能否显示关联数据
  public async createFood (foodData: FoodDto): Promise<Food> {
    if (isEmpty(foodData)) throw new HttpError(400, '参数不能为空')

    const food: Food = await db.food.findFirst({ where: { name: foodData.name } })
    if (food) throw new HttpError(409, `${foodData.name} 已存在`)

    const { specs, ..._foodData } = foodData
    if (specs && specs.length) {
      Object.assign(_foodData, { specs: { create: specs } })
    }

    const _food: Food = await db.food.create({ data: _foodData })

    return _food
  }

  public async search (content: string): Promise<Food> {
    if (isEmpty(content)) throw new HttpError(400, '参数不能为空')

    const data: Food[] = await db.food.findMany({
      where: {
        isDeleted: false,
        name: {
          search: content
        },
        desc: {
          search: content
        },
        detail: {
          search: content
        }
      }
    })

    return data
  }
}

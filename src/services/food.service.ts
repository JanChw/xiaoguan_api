import db from '../db'
import { Food, FoodQuery } from '../types/interfaces/food.interface'
import { FoodDto } from '@/types/dtos/food.dto'
import { isEmpty } from '@utils/util'
import CRUD, { handlePaginationAndOrderArgs } from '@/decorators/crud.decorator'
import { HttpError } from 'routing-controllers'
import { ResultWithCount } from '@/types/interfaces/common.interface'

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

  public async search (content: string, args: FoodQuery): Promise<ResultWithCount> {
    if (isEmpty(content)) throw new HttpError(400, '参数不能为空')
    const { isDeleted, ..._args } = args
    const opts = {
      where: {
        isDeleted,
        name: {
          search: content
        },
        description: {
          search: content
        },
        detail: {
          search: content
        }
      }
    }
    const count = await db.food.count(opts)
    handlePaginationAndOrderArgs(_args, opts)

    const data = await db.food.findMany(opts)

    return { entities: data, count }
  }
}

import db from '@/db'
import CRUD from '@/decorators/crud.decorator'

@CRUD('category')
export class CategoryService {
  async addFoodsToCategory (id: number, foodIds: number[]) {
    return await db.category.update({
      where: { id },
      data: {
        foods: {
          connect: foodIds.map(id => ({ id }))
        }
      }
    })
  }

  async removeFoodsToCategory (id: number, foodIds: number[]) {
    return await db.category.update({
      where: { id },
      data: {
        foods: {
          disconnect: foodIds.map(id => ({ id }))
        }
      }
    })
  }
}

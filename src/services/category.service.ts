import db from '@/db'
import CRUD from '@/decorators/crud.decorator'

import { PaginationAndOrderByDto } from '@/types/dtos/common.dto'

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

  async getFoodsByCategory (args: PaginationAndOrderByDto) {
    const { page, size, orderby } = args
    const paginationAndOrderBy = {}

    const _page = Number(page) || 1
    const _size = Number(size) || 10

    Object.assign(paginationAndOrderBy, {
      skip: (_page - 1) * _size,
      take: _size
    })

    if (orderby) {
      const orderBy = {}
      const [key, value] = orderby.split(':')
      // eslint-disable-next-line dot-notation
      orderBy[key] = value
      Object.assign(paginationAndOrderBy, { orderBy })
    }

    const data = await db.category.findMany({
      select: {
        id: true,
        pid: true,
        name: true,
        _count: { select: { foods: true } },
        foods: {
          ...paginationAndOrderBy
        }
      }
    })
    return data
  }

  async getFoodsOfCategory (categoryId: number, args: PaginationAndOrderByDto) {
    const { page, size, orderby } = args
    const paginationAndOrderBy = {}

    const _page = Number(page) || 1
    const _size = Number(size) || 10

    Object.assign(paginationAndOrderBy, {
      skip: (_page - 1) * _size,
      take: _size
    })

    if (orderby) {
      const orderBy = {}
      const [key, value] = orderby.split(':')
      // eslint-disable-next-line dot-notation
      orderBy[key] = value
      Object.assign(paginationAndOrderBy, { orderBy })
    }

    const [{ foods, _count }] = await db.category.findMany({
      where: { id: categoryId },
      select: {
        _count: { select: { foods: true } },
        foods: {
          ...paginationAndOrderBy
        }
      }
    })
    return { entities: foods, count: _count.foods }
  }
}

import Crud from '@/decorators/crud.decorator'
import db from '@/db'
import { isEmpty } from '@/utils/util'
import { HttpException } from '@/exceptions/HttpException'
export default function CRUD (model: string) {
  return function (target: any) {
    const Model = db[model]
    const crud: Crud = {
      getAll: async (opts = {}) => {
        return await Model.findMany(opts)
      },

      getOneById: async (id: number, opts = {}) => {
        if (isEmpty(id)) throw new HttpException(400, '参数不能为空')

        const repository = await Model.findFirst(Object.assign(opts, { where: { id } }))
        if (!repository) throw new HttpException(404, `${model} 不存在`)

        return repository
      },

      create: async (entity: any, opts = {}) => {
        if (isEmpty(entity)) throw new HttpException(400, '参数不能为空')

        return await Model.create(Object.assign(opts, { data: entity }))
      },
      // TODO:如果有关联数据会报错
      delete: async (id: number) => {
        if (isEmpty(id)) throw new HttpException(400, '参数不能为空')

        const _entity = await Model.findFirst({ where: { id } })
        if (!_entity) { throw new Error(`要删除的${model}不存在`) }

        return await Model.delete({ where: { id } })
      },

      update: async (id: number, entity: any, opts = {}) => {
        if (isEmpty(id) || isEmpty(entity)) throw new HttpException(400, '参数不能为空')
        const _entity = await Model.findFirst({ where: { id } })
        if (!_entity) { throw new Error(`要更新的${model}不存在`) }

        return await Model.update(Object.assign(opts, { where: { id }, data: entity }))
      }
    }

    target.prototype = Object.assign(target.prototype, crud)
  }
}

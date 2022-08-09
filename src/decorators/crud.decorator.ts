import { Crud } from '@/types/interfaces/crud.interface'
import db from '@/db'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
// TODO:错误处理
export default function CRUD (model: string) {
  return function (target: any) {
    const Model = db[model]
    const crud: Crud = {
      getAll: async (opts = {}) => {
        return await Model.findMany(opts)
      },

      getOneById: async (id: number, opts = {}) => {
        if (isEmpty(id)) throw new HttpError(400, '参数不能为空')

        const repository = await Model.findUnique(Object.assign(opts, { where: { id } }))
        if (!repository) throw new HttpError(404, `${model} 不存在`)

        return repository
      },

      create: async (entity: any, opts = {}) => {
        if (isEmpty(entity)) throw new HttpError(400, '参数不能为空')
        return await Model.create(Object.assign(opts, { data: entity }))
      },

      createWithUnique: async (entity: any, unique?: string) => {
        if (isEmpty(entity)) throw new HttpError(400, '参数不能为空')

        if (unique) {
          const whereCondition = { where: {} }
          // eslint-disable-next-line dot-notation
          whereCondition['where'][unique] = entity[unique]
          const model = await Model.findUnique(whereCondition)
          if (model) throw new HttpError(400, `${entity[unique]}已经存在`)
        }
        return await Model.create({ data: entity }).catch(err => console.error(err))
      },
      // TODO:如果有关联数据会报错
      delete: async (id: number) => {
        if (isEmpty(id)) throw new HttpError(400, '参数不能为空')

        const _entity = await Model.findFirst({ where: { id } })
        if (!_entity) { throw new Error(`要删除的${model}不存在`) }

        return await Model.delete({ where: { id } })
      },
      deletes: async (ids: number[]) => {
        if (isEmpty(ids)) throw new HttpError(400, '参数不能为空')

        return await Model.deleteMany({ where: { id: { in: ids } } })
      },

      update: async (id: number, entity: any, opts = {}) => {
        if (isEmpty(id) || isEmpty(entity)) throw new HttpError(400, '参数不能为空')
        const _entity = await Model.findFirst({ where: { id } })
        if (!_entity) { throw new Error(`要更新的${model}不存在`) }

        return await Model.update(Object.assign(opts, { where: { id }, data: entity }))
      },

      updates: async (ids: number[], entity: any, opts = {}) => {
        if (isEmpty(ids) || isEmpty(entity)) throw new HttpError(400, '参数不能为空')
        return await Model.updateMany(Object.assign(opts, { where: { id: { in: ids } }, data: entity })).catch(err => console.error(err))
      }
    }

    target.prototype = Object.assign(target.prototype, crud)
  }
}

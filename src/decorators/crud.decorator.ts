import { CreateRelationOptions, Crud, UpdateRelationOptions } from '@/types/interfaces/crud.interface'
import db from '@/db'
import { isEmpty } from '@/utils/util'
import { HttpError } from 'routing-controllers'
import { PaginationAndOrderBy } from '@/types/interfaces/common.interface'
// TODO:错误处理
export default function CRUD (model: string) {
  return function (target: any) {
    const Model = db[model]
    const crud: Crud = {
      getAll: async (opts = {}) => {
        const { skip, take, include, ..._opts } = opts
        const entities = await Model.findMany(opts)
        const count = await Model.count(_opts)
        return { entities, count }
      },
      getAllWithPagination: (queryData: PaginationAndOrderBy) => async (opts = {}) => {
        const { include, ..._opts } = opts

        handlePaginationAndOrderArgs(queryData, opts)
        const entities = await Model.findMany(opts)
        const count = await Model.count(_opts)
        return { entities, count }
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
      createWithRelations: async (relationOpts: CreateRelationOptions, opts = {}) => {
        const { relation, relations, entity } = relationOpts
        if (isEmpty(entity) || isEmpty(relations) || isEmpty(relation)) throw new HttpError(400, '参数不能为空')
        const relationObj = {}
        relationObj[relation] = { connect: relations.map(id => ({ id })) }
        return await Model.create(Object.assign(opts, { data: entity, ...relationObj }))
      },

      createUniqueWithRelations: async (unique: string, relationOpts: CreateRelationOptions, opts = {}) => {
        const { relation, relations, entity } = relationOpts
        console.log(relationOpts)
        if (isEmpty(entity) || isEmpty(relations) || isEmpty(relation) || isEmpty(unique)) throw new HttpError(400, '参数不能为空')

        const whereCondition = { where: {} }
        // eslint-disable-next-line dot-notation
        whereCondition['where'][unique] = entity[unique]
        const model = await Model.findUnique(whereCondition)
        if (model) throw new HttpError(400, `${entity[unique]}已经存在`)

        const relationObj = {}
        relationObj[relation] = { connect: relations.map(id => ({ id })) }
        return await Model.create(Object.assign(opts, { data: { ...entity, ...relationObj } }))
      },

      createWithUnique: async (unique: string, entity: any, opts = {}) => {
        if (isEmpty(entity)) throw new HttpError(400, '参数不能为空')

        const whereCondition = { where: {} }
        // eslint-disable-next-line dot-notation
        whereCondition['where'][unique] = entity[unique]
        const model = await Model.findUnique(whereCondition)
        if (model) throw new HttpError(400, `${entity[unique]}已经存在`)
        return await Model.create({ data: entity }, opts)
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
        console.log(id)
        console.log(entity)
        if (isEmpty(id) || isEmpty(entity)) throw new HttpError(400, '参数不能为空')
        const _entity = await Model.findFirst({ where: { id } })
        if (!_entity) { throw new Error(`要更新的${model}不存在`) }

        return await Model.update(Object.assign(opts, { where: { id }, data: entity }))
      },
      updateRelations: (updateRelationOpts: UpdateRelationOptions) => async (id: number, opts = {}) => {
        const { op, relation, relations } = updateRelationOpts
        const self = crud
        const entity = {}
        console.log(updateRelationOpts)

        op === 'add' && (entity[relation] = { connect: relations.map(id => ({ id })) })
        op === 'remove' && (entity[relation] = { disconnect: relations.map(id => ({ id })) })

        return await self.update(id, entity, opts)
      },

      updates: async (ids: number[], entity: any, opts = {}) => {
        if (isEmpty(ids) || isEmpty(entity)) throw new HttpError(400, '参数不能为空')
        return await Model.updateMany(Object.assign(opts, { where: { id: { in: ids } }, data: entity }))
      }
    }

    Object.assign(target.prototype, crud)
  }
}

export function handlePaginationAndOrderArgs (args: PaginationAndOrderBy, opts: Object) {
  let { page, size, orderby } = args
  size = Number(size) || 15
  page = Number(page) || 1
  const skip = (page - 1) * size
  const take = size
  Object.assign(opts, { skip, take })
  if (orderby) {
    if (!orderby.includes(':')) throw new HttpError(400, 'orderby参数格式错误')
    const orderBy = {}
    const [key, value] = orderby.split(':')
    orderBy[key] = value
    Object.assign(opts, { orderBy })
  }
}

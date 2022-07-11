import Crud from '@/decorators/crud.decorator'
import db from '@/db'
export default function CRUD (model: string) {
  return function (target: any) {
    const repository = db[model]
    const crud: Crud = {
      getAll: async () => {
        return await repository.findMany()
      },
      getOneById: async (id: number) => {
        return await repository.findFirst({ where: { id } })
      },
      create: async (entity: any) => {
        return await repository.create({ data: entity })
      },
      delete: async (id: number) => {
        const _entity = await repository.findFirst({ where: { id } })
        if (!_entity) { throw new Error('Not Fount') }

        return await repository.delete({ where: { id } })
      },
      update: async (id: number, entity: Partial<any>) => {
        const _entity = await repository.findFirst({ where: { id } })
        if (!_entity) { throw new Error('Not Fount') }

        return await repository.update({ where: { id }, data: entity })
      }
    }

    target.prototype = Object.assign(target.prototype, crud)
  }
}

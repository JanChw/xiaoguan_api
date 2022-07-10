import Crud from '@/decorators/crud.decorator'
import db from '@/db'
export default function CRUD (model: string) {
  return function (target: any) {
    const repository = db[model]
    const crud: Crud = {
      getAll: async () => {
        // throw new Error('error from crud')
        console.log('data from @crud')
        return await repository.findMany()
      },
      getOneById: async (id: number) => {
        return await repository.findFirst({ where: { id } })
      },
      create: async (entity: any) => {
        return repository.create({ data: entity })
      },
      delete: async (id: number) => {
        return repository.delete(id)
      },
      update: async (id: number, entity: Partial<any>) => {
        return repository.update({ where: { id }, data: entity })
      }
    }

    target.prototype = Object.assign(target.prototype, crud)
  }
}

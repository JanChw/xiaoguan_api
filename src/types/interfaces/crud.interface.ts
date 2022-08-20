import { Pagination } from './common.interface'

export interface DeleteManyOptions {
  propName: string,
  propValues: Array<any>
}

export interface CreateRelationOptions {
  entity: Object,
  relation: string,
  relations: number[]
}

export interface UpdateRelationOptions {
  op: 'add' | 'remove',
  relation: string,
  relations: number[]
}

export interface Crud {
  getAll: (opts: Object) => Promise<any>,

  getAllWithPagination: (pagination: Pagination) => ((opts: Object) => Promise<any>),

  getOneById: (id: number, opts: Object) => Promise<any>,

  create: (entity: any) => Promise<any>,

  createWithRelations: (relationOpts: CreateRelationOptions) => Promise<any>,

  createUniqueWithRelations: (unique: string, relationOpts: CreateRelationOptions) => Promise<any>,

  createWithUnique: (unique: string, entity: any, opts: Object) => Promise<any>

  update: (id: number, entity: Partial<any>, opts: Object) => Promise<any>

  updates: (ids: number[], entity: Partial<any>, opts:Object) => Promise<any>

  updateRelations: (updateRelationOpts: UpdateRelationOptions) => ((id:number, entity: Partial<any>, opts: Object) => Promise<any>)

  delete: (id: number) => Promise<any>,

  deletes: (ids: number[]) => Promise<any>,
}

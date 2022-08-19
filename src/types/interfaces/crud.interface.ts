
export interface DeleteManyOptions {
  propName: string,
  propValues: Array<any>
}

export interface Crud {
  getAll: (opts: Object) => Promise<any>,

  getOneById: (id: number, opts: Object) => Promise<any>,

  create: (entity: any) => Promise<any>,

  createWithRelations: (entity: any, relation: string, relations: number[]) => Promise<any>,

  createWithUnique: (entity: any, unique?: string) => Promise<any>

  update: (id: number, entity: Partial<any>, opts: Object) => Promise<any>

  updates: (ids: number[], entity: Partial<any>, opts:Object) => Promise<any>

  updateRelations: (relation: string, relationIds: number[], op: 'add'| 'remove') => ((id:number, entity: Partial<any>, opts: Object) => Promise<any>)

  delete: (id: number) => Promise<any>,

  deletes: (ids: number[]) => Promise<any>,
}

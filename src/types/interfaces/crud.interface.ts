
export interface DeleteManyOptions {
  propName: string,
  propValues: Array<any>
}

export interface Crud {
  getAll: () => Promise<any>,
  getOneById: (id: number) => Promise<any>,
  create: (entity: any) => Promise<any>,
  createWithUnique: (entity: any, unique?: string) => Promise<any>
  delete: (id: number) => Promise<any>,
  deletes: (ids: number[]) => Promise<any>,
  update: (id: number, entity: Partial<any>) => Promise<any>
  updates: (ids: number[], entity: Partial<any>) => Promise<any>
}

export default interface Crud {
  getAll: () => Promise<any>,
  getOneById: (id: number) => Promise<any>,
  create: (entity: any) => Promise<any>,
  delete: (id: number) => Promise<any>,
  update: (id: number, entity: Partial<any>) => Promise<any>
}

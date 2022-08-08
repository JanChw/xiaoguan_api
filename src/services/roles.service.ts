import CRUD from '@/decorators/crud.decorator'
import db from '@/db'

@CRUD('role')
export class RoleService {
  async opPermissionsToRole (permissionIDs: number[], roleId: number, op = 'add') {
    // const { resources } = await this.getOneById(id)

    let update = []
    if (op === 'add') {
      update = permissionIDs.map(id => {
        return { category: { connect: { id } } }
      })
    }

    if (op === 'delete') {
      update = permissionIDs.map(id => {
        return { category: { disconnect: { id } } }
      })
    }

    return await db.role.update({
      data: {
        resources: {
          update
        }
      }
    })
  }
}

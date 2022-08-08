import CRUD from '@/decorators/crud.decorator'
import db from '@/db'

@CRUD('role')
export class RoleService {
  async opPermissionsToRole (permissionIDs: number[], roleId: number, op = 'add') {
    // const { resources } = await this.getOneById(id)

    let update = []
    if (op === 'add') {
      update = permissionIDs.map(id => {
        return { resource: { connect: { id } } }
      })

      return await db.role.update({
        where: { id: roleId },
        data: {
          resources: {
            create: update
          }
        }
      })
    }

    if (op === 'remove') {
      update = permissionIDs.map(id => {
        return { id }
      })

      return await db.rolesOnresources.deleteMany({
        where: { roleId, resourceId: { in: permissionIDs } }
      })
    }
    console.log(update)
  }
}

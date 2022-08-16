import CRUD from '@/decorators/crud.decorator'
import db from '@/db'
import { HttpError } from 'routing-controllers'

@CRUD('role')
export class RoleService {
  async addPermissionsToRole (permissionIDs: number[], roleId: number) {
    const resources = await db.resource.findMany({
      where: {
        id: { in: permissionIDs }
      }
    })

    if (resources.length < permissionIDs.length) {
      throw new HttpError(400, '参数非法,要添加项不存在！')
    }

    return await db.role.update({
      where: { id: roleId },
      data: {
        resources: {
          connect: permissionIDs.map(id => ({ id }))
        }
      }
    })
  }

  async removePermissionsToRole (permissionIDs: number[], roleId: number) {
    return await db.role.update({
      where: { id: roleId },
      data: {
        resources: {
          deleteMany: {
            id: { in: permissionIDs }
          }
        }
      }
    })
  }
}

import db from '@/db'
import CRUD from '@/decorators/crud.decorator'
import { StaffDto } from '@/types/dtos/staffs.dto'
import { Staff } from '@/types/interfaces/staffs.interface'
import { isEmpty } from '@/utils/util'
import { hash } from 'bcrypt'
import { HttpError } from 'routing-controllers'

const selectOpts = {
  id: true,
  name: true,
  phone: true
}

@CRUD('staff')
export class StaffService {
  public async createStaff (staffData: StaffDto): Promise<Staff> {
    // TODO: 参数为空的逻辑放到全局中间件
    if (isEmpty(staffData)) throw new HttpError(400, '参数不能为空')

    const findStaff: Staff = await db.staff.findFirst({ where: { phone: staffData.phone } })
    console.log(findStaff)
    if (findStaff) throw new HttpError(409, '此电话号已注册')

    const hashedPassword = await hash(staffData.password, 10)
    staffData.password = hashedPassword
    const createStaffData: Staff = db.staff.create({ data: staffData, select: selectOpts })

    return createStaffData
  }

  async opRolesToStaff (roleIDs: number[], staffId: number, op = 'add') {
    let update = []
    if (op === 'add') {
      update = roleIDs.map(id => {
        return { role: { connect: { id } } }
      })

      return await db.staff.update({
        where: { id: staffId },
        data: {
          roles: {
            create: update
          }
        },
        include: { roles: true }
      })
    }

    if (op === 'remove') {
      update = roleIDs.map(id => {
        return { id }
      })

      return await db.rolesOnstaffs.deleteMany({
        where: { staffId, roleId: { in: roleIDs } }
      })
    }
  }

  async getOneWithRelations (staffId: number) {
    const staffSelect = { id: true, name: true, phone: true, isCopartner: true, hireDate: true, leaveDate: true, roles: true }
    const staff = await db.staff.findUnique({ where: { id: staffId }, select: staffSelect })
    const roleIds = staff.roles.map(role => role.roleId)
    const permissionIdObjs = await db.rolesOnresources.findMany({ where: { roleId: { in: roleIds } } })
    const permissionIds = permissionIdObjs.map(item => item.resourceId)
    const permissions = await db.resource.findMany({ where: { id: { in: permissionIds } }, select: { permission: true } })
    // eslint-disable-next-line dot-notation
    staff['permissions'] = permissions.map(item => item.permission)
    return staff
  }
}

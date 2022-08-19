import db from '@/db'
import CRUD from '@/decorators/crud.decorator'
import { StaffDto } from '@/types/dtos/staff.dto'
import { Staff } from '@/types/interfaces/staff.interface'
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
    const relationRecords = roleIDs.map(id => {
      return { id }
    })
    const data = { roles: {} }
    if (op === 'add') {
      // eslint-disable-next-line dot-notation
      data['roles']['connect'] = relationRecords
    }

    if (op === 'remove') {
      // eslint-disable-next-line dot-notation
      data['roles']['disconnect'] = relationRecords
    }

    return await db.staff.update({
      where: { id: staffId },
      include: { roles: true },
      data
    })
  }
}

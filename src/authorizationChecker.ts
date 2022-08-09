import { Action } from 'routing-controllers'
import { verify } from 'jsonwebtoken'
import { StaffService } from '@/services/staffs.service'
const { SECRET_KEY } = process.env

const authorizationChecker = async (action: Action, permission: string[]) => {
  const token = action.request.headers.authorization.split(' ')[1]
  const [_permission] = permission
  const { id } = await verify(token, SECRET_KEY)
  const { permissions } = await new StaffService().getOneWithRelations(id)
  if (permissions.includes(_permission)) return true
  return false
}

export default authorizationChecker

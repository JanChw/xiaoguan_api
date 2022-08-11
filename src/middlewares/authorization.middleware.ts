import { Action, HttpError } from 'routing-controllers'
import { verify } from 'jsonwebtoken'
import { StaffService } from '@/services/staffs.service'
const { SECRET_KEY } = process.env
const JWT_INVALID = 'invalid signature'
const JWT_EXPIRED = 'jwt expired'

const authorizationChecker = async (action: Action, permission: string[]) => {
  try {
    const authorization = action.request.headers.authorization
    if (!authorization) throw new HttpError(403, '请先登录')
    const token = authorization.split(' ')[1]
    const [_permission] = permission
    const { id } = await verify(token, SECRET_KEY)
    const { permissions } = await new StaffService().getOneWithRelations(id)
    if (permissions.includes(_permission)) return true
    return false
  } catch (error) {
    if (error.message === JWT_INVALID) { error.message = ' token非法' }

    if (error.message === JWT_EXPIRED) { error.message = 'token过期' }

    throw new HttpError(403, error.message)
  }
}

export default authorizationChecker

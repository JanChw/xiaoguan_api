import { Action, HttpError } from 'routing-controllers'
import { verify } from 'jsonwebtoken'
import { UserService } from '@/services/user.service'
const { SECRET_KEY } = process.env
const JWT_INVALID = 'invalid signature'
const JWT_EXPIRED = 'jwt expired'

const currentUserChecker = async (action: Action) => {
  try {
    const authorization = action.request.headers.authorization
    if (!authorization) throw new HttpError(403, '请先登录')
    const token = authorization.split(' ')[1]
    const { id } = await verify(token, SECRET_KEY)

    return await new UserService().findUser({ id })
  } catch (error) {
    if (error.message === JWT_INVALID) { error.message = ' token非法' }

    if (error.message === JWT_EXPIRED) { error.message = 'token过期' }

    throw new HttpError(403, error.message)
  }
}

export default currentUserChecker

import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { SECRET_KEY } from '@config'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, RequestWithUser } from '@/types/interfaces/auth.interface'
import UserService from '@/services/user.service'

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userService = new UserService()
  try {
    const Authorization = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null)

    if (Authorization) {
      const secretKey: string = SECRET_KEY
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken
      const userId = verificationResponse.id
      const findUser = userService.findUser({ id: userId })

      if (findUser) {
        req.user = findUser
        next()
      } else {
        next(new HttpException(401, 'token 无效'))
      }
    } else {
      next(new HttpException(404, '未带token'))
    }
  } catch (error) {
    next(new HttpException(401, 'token 无效'))
  }
}

export default authMiddleware

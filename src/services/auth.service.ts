import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { SECRET_KEY } from '@config'
import { UserDto, LoginDto } from '@/types/dtos/users.dto'
import { DataStoredInToken, TokenData } from '@/types/interfaces/auth.interface'
import { User } from '@/types/interfaces/users.interface'
import userModel from '@models/users.model'
import { isEmpty } from '@utils/util'
import db from '@/db'
import { HttpError } from 'routing-controllers'

const selectOpts = {
  id: true,
  name: true,
  phoneNumber: true
}

class AuthService {
  public user = userModel;

  public async signup (userData: UserDto): Promise<User> {
    // TODO: 参数为空的逻辑放到全局中间件
    if (isEmpty(userData)) throw new HttpError(400, '参数不能为空')

    const findUser: User = await db.user.findFirst({ where: { phoneNumber: userData.phoneNumber } })
    console.log(findUser)
    if (findUser) throw new HttpError(409, '此电话号已注册')

    const hashedPassword = await hash(userData.password, 10)
    userData.password = hashedPassword
    const createUserData: User = db.user.create({ data: userData, select: selectOpts })

    return createUserData
  }

  public async login (userData: LoginDto): Promise<{ token: TokenData; findUser: User }> {
    if (isEmpty(userData)) throw new HttpError(400, '参数不能为空')

    const findUser: User = await db.user.findFirst({ where: { phoneNumber: userData.phoneNumber } })
    if (!findUser) throw new HttpError(409, '该手机号的用户不存在')

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password)
    if (!isPasswordMatching) throw new HttpError(409, '密码输入错误')

    const token = this.createToken(findUser)

    return { token, findUser }
  }

  public createToken (user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id }
    const secretKey: string = SECRET_KEY
    const expiresIn: number = 60 * 60

    return { token: sign(dataStoredInToken, secretKey, { expiresIn }) }
  }

  public createCookie (tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
  }
}

export default AuthService

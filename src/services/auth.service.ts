import { compare, hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { SECRET_KEY } from '@config'
import { UserDto, LoginDto } from '@/types/dtos/user.dto'
import { DataStoredInToken, TokenData } from '@/types/interfaces/auth.interface'
import { User } from '@/types/interfaces/user.interface'
import { isEmpty } from '@utils/util'
import db from '@/db'
import { HttpError } from 'routing-controllers'

const selectOpts = {
  id: true,
  name: true,
  phone: true
}

class AuthService {
  public async signup (userData: UserDto): Promise<Partial<User>> {
    // TODO: 参数为空的逻辑放到全局中间件
    if (isEmpty(userData)) throw new HttpError(400, '参数不能为空')

    const findUser: User = await db.user.findFirst({ where: { phone: userData.phone } })
    console.log(findUser)
    if (findUser) throw new HttpError(409, '此电话号已注册')

    const hashedPassword = await hash(userData.password, 10)
    userData.password = hashedPassword
    const createUserData: Partial<User> = await db.user.create({ data: userData, select: selectOpts })

    return createUserData
  }

  public async login (data: LoginDto, kind: 'user' | 'staff'): Promise<{ token: TokenData; findUser: User }> {
    if (isEmpty(data)) throw new HttpError(400, '参数不能为空')

    const findData: User = await db[kind].findFirst({ where: { phone: data.phone } })
    if (!findData) throw new HttpError(409, '该手机号不存在')

    const isPasswordMatching: boolean = await compare(data.password, findData.password)
    if (!isPasswordMatching) throw new HttpError(409, '密码输入错误')

    const token = this.createToken(findData, kind)

    return { token, findUser: findData }
  }

  public createToken (user: User, kind: 'user'| 'staff'): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, kind }
    const secretKey: string = SECRET_KEY
    const expiresIn: number | string = '7d'

    return { token: sign(dataStoredInToken, secretKey, { expiresIn }) }
  }
}

export default AuthService

import { hash } from 'bcrypt'
import { CreateUserDto, UpdateUserPartialDto } from '@/types/dtos/users.dto'
import { HttpException } from '@exceptions/HttpException'
import { User } from '@/types/interfaces/users.interface'
import { isEmpty } from '@utils/util'
import db from '../db'

class UserService {
  public async findAllUser (): Promise<User[]> {
    const users: User[] = await db.user.findMany()
    return users
  }

  public async findUserById (userId: number): Promise<User> {
    const findUser: User = await db.user.findFirst({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user")

    return findUser
  }

  public async createUser (userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

    const findUser: User = await db.user.findFirst({ where: { email: userData.email } })
    if (findUser) throw new HttpException(409, `Your email ${userData.email} already exists`)

    const hashedPassword = await hash(userData.password, 10)
    userData.password = hashedPassword

    const createUserData: User = await db.user.create({ data: userData })

    return createUserData
  }

  public async updateUser (userId: number, userData: UpdateUserPartialDto): Promise<User[]> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

    const findUser: User = await db.user.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user")

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10)
      userData.password = hashedPassword
    }

    const updateUserData: User[] = await db.user.update({
      where: { id: userId },
      data: userData
    })

    return updateUserData
  }

  public async deleteUser (userId: number): Promise<User[]> {
    const findUser: User = await db.user.findFirst({ where: { id: userId } })
    if (!findUser) throw new HttpException(409, "You're not user")

    const deleteUserData: User[] = await db.user.delete({ where: { id: userId } })
    return deleteUserData
  }
}

export default UserService

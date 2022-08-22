import { hash } from 'bcrypt'
import { UserDto } from '@/types/dtos/user.dto'
import { User, UserQuery } from '@/types/interfaces/user.interface'
import { isEmpty } from '@utils/util'
import db from '@/db'
import { HttpError } from 'routing-controllers'
import { handlePaginationAndOrderArgs } from '@/decorators/crud.decorator'

const selectOpts = {
  id: true,
  name: true,
  phone: true,
  addresses: true,
  createdAt: true
}

const _selectOpts = {
  id: true,
  name: true,
  phone: true,
  addresses: true,
  cart: true,
  orders: true
}

// 修改 查询 删除
export class UserService {
  public async findUser (opts: Partial<User>): Promise<User> {
    const user: User = await db.user.findFirst({ where: opts, select: selectOpts })
    return user
  }

  public async findAllUser (): Promise<User> {
    const users: User[] = await db.user.findMany({ select: selectOpts })

    return users
  }

  public async search (queryData: UserQuery): Promise<{entities: any, count: number}> {
    const { content, ..._queryData } = queryData
    if (isEmpty(content)) throw new HttpError(400, '参数不能为空')
    const condition = {
      where: {
        name: {
          search: content
        },
        phone: {
          search: content
        }
      },
      select: _selectOpts
    }
    const count = await db.user.count({ where: condition.where })
    handlePaginationAndOrderArgs(_queryData, condition)
    const entities = await db.user.findMany(condition)

    return { entities, count }
  }

  public async updateUser (userId: number, userData: Partial<UserDto>): Promise<User[]> {
    if (isEmpty(userData)) throw new HttpError(400, '参数不能为空')

    const findUser: User = await db.user.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpError(409, '用户不存在')

    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10)
      userData.password = hashedPassword
    }

    const updateUserData: User[] = await db.user.update({
      where: { id: userId },
      data: userData,
      select: selectOpts
    })

    return updateUserData
  }

  public async deleteUser (userId: number): Promise<User[]> {
    const findUser: User = await db.user.findUnique({ where: { id: userId } })
    if (!findUser) throw new HttpError(409, '用户不存在')

    const deleteUserData: User[] = await db.user.delete({ where: { id: userId }, select: selectOpts })
    return deleteUserData
  }
}

export default UserService

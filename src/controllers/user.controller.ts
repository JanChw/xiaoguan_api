import { Controller, Param, Body, Get, Put, Delete, UseBefore, QueryParam, QueryParams } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { UserDto, UserQueryDto } from '@/types/dtos/user.dto'
import { User } from '@/types/interfaces/user.interface'
import UserService from '@/services/user.service'
import { validationMiddleware } from '@middlewares/validation.middleware'
import { PaginationAndOrderByDto } from '@/types/dtos/common.dto'

const selectOpts = {
  id: true,
  name: true,
  phone: true,
  addresses: true,
  cart: true,
  orders: true
}

const _selectOpts = {
  id: true,
  name: true,
  phone: true,
  addresses: true,
  createdAt: true
}

@Controller()
export class UsersController {
  public userService = new UserService();

  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers (@QueryParams() queryData: PaginationAndOrderByDto) {
    // const findAllUsersData: User[] = await this.userService.findAllUser()
    const data = await this.userService.getAllWithPagination(queryData)({
      select: _selectOpts
    })
    return { data, message: 'findAll' }
  }

  @Get('/users/search')
  @OpenAPI({ summary: 'fulltext' })
  async searchFullText (@QueryParams() queryData: UserQueryDto) {
    const { content, ..._queryData } = queryData
    const data: User[] = content
      ? await this.userService.search(content)
      : await this.userService.getAllWithPagination(_queryData)({ select: _selectOpts })

    return { data, message: 'search' }
  }

  @Get('/user/:id')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById (@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findUser({ id: userId })
    return { data: findOneUserData, message: 'findOne' }
  }

  @Put('/user/:id')
  @UseBefore(validationMiddleware(UserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser (@Param('id') userId: number, @Body() userData: Partial<UserDto>) {
    const updateUserData: User[] = await this.userService.updateUser(userId, userData)
    return { data: updateUserData, message: 'updated' }
  }

  @Delete('/user/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser (@Param('id') userId: number) {
    const deleteUserData: User[] = await this.userService.deleteUser(userId)
    return { data: deleteUserData, message: 'deleted' }
  }
}

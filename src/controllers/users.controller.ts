import { Controller, Param, Body, Get, Post, Put, Delete, HttpCode, UseBefore } from 'routing-controllers'
import { OpenAPI } from 'routing-controllers-openapi'
import { UserDto } from '@/types/dtos/users.dto'
import { User } from '@/types/interfaces/users.interface'
import UserService from '@services/users.service'
import { validationMiddleware } from '@middlewares/validation.middleware'

@Controller()
export class UsersController {
  public userService = new UserService();

  @Get('/users')
  @OpenAPI({ summary: 'Return a list of users' })
  async getUsers () {
    const findAllUsersData: User[] = await this.userService.findAllUser()
    return { data: findAllUsersData, message: 'findAll' }
  }

  @Get('/users/:id')
  @OpenAPI({ summary: 'Return find a user' })
  async getUserById (@Param('id') userId: number) {
    const findOneUserData: User = await this.userService.findUser({ id: userId })
    return { data: findOneUserData, message: 'findOne' }
  }

  @Put('/users/:id')
  @UseBefore(validationMiddleware(UserDto, 'body', true))
  @OpenAPI({ summary: 'Update a user' })
  async updateUser (@Param('id') userId: number, @Body() userData: Partial<UserDto>) {
    const updateUserData: User[] = await this.userService.updateUser(userId, userData)
    return { data: updateUserData, message: 'updated' }
  }

  @Delete('/users/:id')
  @OpenAPI({ summary: 'Delete a user' })
  async deleteUser (@Param('id') userId: number) {
    const deleteUserData: User[] = await this.userService.deleteUser(userId)
    return { data: deleteUserData, message: 'deleted' }
  }
}

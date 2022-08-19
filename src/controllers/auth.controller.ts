import { Response } from 'express'
import { Controller, Body, Post, UseBefore, HttpCode, Res, Param } from 'routing-controllers'
import { UserDto, LoginDto } from '@/types/dtos/user.dto'
import { User } from '@/types/interfaces/user.interface'
import { validationMiddleware } from '@middlewares/validation.middleware'
import AuthService from '@services/auth.service'

@Controller()
export class AuthController {
  public authService = new AuthService();

  @Post('/signup')
  @UseBefore(validationMiddleware(UserDto, 'body'))
  @HttpCode(201)
  async signUp (@Body() userData: UserDto) {
    const user: User = await this.authService.signup(userData)
    delete user.password
    return { data: user, message: 'signup' }
  }

  @Post('/:role/login')
  @UseBefore(validationMiddleware(LoginDto, 'body'))
  async logIn (@Res() res: Response, @Body() userData: LoginDto, @Param('role') role: 'user'|'staff') {
    const { token } = await this.authService.login(userData, role)

    return { data: token, message: 'login' }
  }
}

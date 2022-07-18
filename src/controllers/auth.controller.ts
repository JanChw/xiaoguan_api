import { Response } from 'express'
import { Controller, Body, Post, UseBefore, HttpCode, Res } from 'routing-controllers'
import { UserDto, LoginDto } from '@/types/dtos/users.dto'
// import { RequestWithUser } from '@/types/interfaces/auth.interface'
import { User } from '@/types/interfaces/users.interface'
// import authMiddleware from '@middlewares/auth.middleware'
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

  @Post('/login')
  @UseBefore(validationMiddleware(LoginDto, 'body'))
  async logIn (@Res() res: Response, @Body() userData: LoginDto) {
    const { token } = await this.authService.login(userData)

    return { data: token, message: 'login' }
  }
}

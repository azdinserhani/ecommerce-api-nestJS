import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //@Desc: This method will allow user signup
  //@Route: post /api/v1/auth/signup
  //@Access: public
  @Post('/signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  //@Desc: This method will allow user signup
  //@Route: POST /api/v1/auth/signup
  //@Access: public
  @Post('/signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  //@Desc: any user can reset password
  //@Route: POST /api/v1/auth/reset-password
  //@Access: public
  @Post('/reset-password')
  resetPassword(@Body() email: ResetPasswordDto) {
    return this.authService.resetPassword(email);
  }

  //@Desc: any user can verify code
  //@Route: POST /api/v1/auth/verify-code
  //@Access: public
  @Post('/verify-code')
  verifyCode(@Body() verifyCode: { email: ResetPasswordDto; code: string }) {
    return this.authService.verifyCode(verifyCode);
  }

  //@Desc: any user can change password
  //@Route: POST /api/v1/auth/change-password
  //@Access: public
  @Post('/change-password')
  changePassword(@Body() { email, password }: SignInDto) {
    return this.authService.changePassword({ email, password });
  }
}

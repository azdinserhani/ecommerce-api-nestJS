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
import { SignInDto, SignUpDto } from './dto/auth.dto';
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
  //@Route: post /api/v1/auth/signup
  //@Access: public
  @Post('/signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
}

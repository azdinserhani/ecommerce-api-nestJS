import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signup(signUpDto: SignUpDto) {
    try {
      const createdUser = await new this.userModel(signUpDto).save();

      const payload = {
        _id: createdUser._id,
        role: createdUser.role,
      };
      const { password, ...result } = createdUser.toObject();
      const access_token = this.jwtService.sign(payload);
      return { status: 200, data: result, access_token };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);
    if (!isPasswordMatch) {
      throw new ConflictException('Invalid email or password');
    }

    const payload = {
      _id: findUser._id,
      role: findUser.role,
    };
    const access_token = this.jwtService.sign(payload);
    const { password: _, ...result } = findUser.toObject();
    return { status: 200, data: result, access_token };
  }
}

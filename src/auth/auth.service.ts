import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ResetPasswordDto, SignInDto, SignUpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
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
  async resetPassword({ email }: ResetPasswordDto) {
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    //create code from 6 digits
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    //store the code in the database
    findUser.verificationCode = resetCode;
    await findUser.save();

    //send code to user email
    const message = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hi ${findUser.name},</p>
        <p>We received a request to reset your password. Use the code below to reset it:</p>
        <div style="font-size: 20px; font-weight: bold; margin: 20px 0; color: #4CAF50;">
          ${resetCode}
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Thanks,<br>The Team</p>
        <h6>Ecommerce-NestJS</h6>
      </div>
    `;
    try {
      this.mailService.sendMail({
        from: `"Ecommerce-NestJS" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: `Ecommerce-NestJS Reset Password`,
        html: message,
      });

      return {
        status: 200,
        message: `code send succuss on your email ${email}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send reset password email',
      );
    }
  }

  async verifyCode({ email, code }: { email: ResetPasswordDto; code: string }) {
    const findUser = await this.userModel
      .findOne({ email })
      .select(['verificationCode']);

    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    if (findUser.verificationCode !== code) {
      throw new UnauthorizedException();
    }
    await this.userModel.findOneAndUpdate(
      { email },
      { verificationCode: null },
    );
    return {
      status: 200,
      message: 'code verified succuss. go to change your password',
    };
  }
  async changePassword({ email, password }: SignInDto) {
    const findUser = await this.userModel.findOne({ email });

    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
    );

    return {
      status: 200,
      message: 'Password changed successfully',
    };
  }
}

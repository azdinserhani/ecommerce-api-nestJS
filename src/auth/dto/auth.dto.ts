import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
  // name
  @IsString()
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(30, { message: 'name must be less than 30 characters' })
  name: string;

  // email
  @IsString()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  // password
  @IsString()
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must be less than 20 characters' })
  password: string;
}
export class SignInDto {
  // email
  @IsString()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  // password
  @IsString()
  @MinLength(3, { message: 'password must be at least 3 characters' })
  @MaxLength(20, { message: 'password must be less than 20 characters' })
  password: string;
}

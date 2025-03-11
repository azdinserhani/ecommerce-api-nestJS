import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNumber,
  Length,
  MinLength,
  MaxLength,
  Min,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
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

    // role
    @IsString()
    @IsEnum(['Admin', 'user'], { message: 'role must be either Admin or user' })
    role: string;

    // avatar
    @IsOptional()
    @IsString()
    @IsUrl()
    avatar?: string;

    // age
    @IsOptional()
    @IsNumber()
    age?: number;

    // phoneNumber
    @IsOptional()
    @IsString()
    @IsPhoneNumber('MA', {
        message: 'phoneNumber must be a valid phone number in Morocco',
    })
    phoneNumber?: string;

    // address
    @IsOptional()
    @IsString()
    address?: string;

    // active
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    // verificationCode
    @IsOptional()
    @IsString()
    @Length(6, 6, { message: 'verificationCode must be 6 character' })
    verificationCode?: string;

    // gender
    @IsOptional()
    @IsString()
    @IsEnum(['male', 'female'], {
        message: 'gender must be either male or female',
    })
    gender?: string;
 
}

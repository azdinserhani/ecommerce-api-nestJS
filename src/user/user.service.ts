import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.active = true;
      const createdUser = await this.userModel.create(createUserDto);
      const { password, ...result } = createdUser.toObject();
      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findAll(limit = 8, page = 1) {
    return await this.userModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .select(['-password', '-__v']);
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id).select(['-password']);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .select(['-password']);
    if (!updatedUser) {
      throw new NotFoundException();
    }
    return updatedUser;
  }

  async remove(id: string, payload) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    if (id === payload.id) {
      throw new BadRequestException('You cannot delete your own account');
    }
    return await this.userModel.findByIdAndDelete(id);
  }
}

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
import { GetUsersQueryDto } from './dto/get-user.dto';

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
  async findAll(query: GetUsersQueryDto) {
    const { offset, limit, email, name } = query;
    const filter: any = {};
    if (name) {
      filter.name = new RegExp(name.trim(), 'i');
    }
    if (email) {
      filter.email = new RegExp(email.trim(), 'i');
    }
    const users = await this.userModel
      .find(filter)
      .skip(offset ?? 0)
      .limit(limit ?? 100);
    return {
      status: 200,
      length: users.length,
      data: users,
    };
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

  async getUserMe(payload) {
    if (!payload._id) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      data: await this.userModel
        .findById(payload._id)
        .select(['-password', '-__v']),
    };
  }
  async updateUserMe(payload, updatedInfo: UpdateUserDto) {
    if (updatedInfo.role) {
      throw new BadRequestException("you can't update your role");
    }
    if (updatedInfo.password) {
      const salt = await bcrypt.genSalt();
      updatedInfo.password = await bcrypt.hash(updatedInfo.password, salt);
    }
    return {
      status: 200,
      data: await this.userModel
        .findByIdAndUpdate(payload._id, updatedInfo, {
          new: true,
          runValidators: true,
        })
        .select(['-password', '-__v']),
    };
  }

  async deleteUserMe(payload) {
    if (!payload._id) {
      throw new NotFoundException();
    }
    await this.userModel.findByIdAndUpdate(payload._id, { active: false });
  }
}

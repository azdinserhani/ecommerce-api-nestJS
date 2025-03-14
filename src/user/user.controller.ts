import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { request } from 'express';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('user')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
// @UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Desc: This method will create a user
  //@Route: POST /api/v1/users
  //@Access: private ['admin']
  @Post()
  @Roles(['admin'])
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      status: 200,
      message: 'user created succuss',
      data: await this.userService.create(createUserDto),
    };
  }

  //@Desc: This method will return all the user
  //@Route: GET /api/v1/users
  //@Access: private ['admin']
  @Get()
  @Roles(['admin'])
  async findAll(@Query() { limit, page }) {
    return {
      status: 200,
      page: page,
      data: await this.userService.findAll(limit, page),
    };
  }

  //@Desc: This method will return user by id
  //@Route: GET /api/v1/users/:id
  //@Access: private ['admin']
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: 200,
      data: await this.userService.findOne(id),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      status: 200,
      data: await this.userService.update(id, updateUserDto),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    await this.userService.remove(id, req.user);
    return {
      status: 200,
      message: 'user has been delete',
    };
  }
}

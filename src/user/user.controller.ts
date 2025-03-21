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
import { query, request } from 'express';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { GetUsersQueryDto } from './dto/get-user.dto';

//=================================================For admins================================================//
@Controller('user')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  //=================================================For Admin================================================//
  //@Desc: This method will create a user
  //@Route: POST /api/v1/user
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
  //@Route: GET /api/v1/user
  //@Access: private ['admin']
  @Get()
  @Roles(['admin'])
  async findAll(@Query() query: GetUsersQueryDto) {
    return await this.userService.findAll(query);
  }

  //@Desc: This method will return user by id
  //@Route: GET /api/v1/user/:id
  //@Access: private ['admin']
  @Get(':id')
  @Roles(['admin'])
  async findOne(@Param('id') id: string) {
    return {
      status: 200,
      data: await this.userService.findOne(id),
    };
  }

  //@Desc: This method will update user by id
  //@Route: PATCH /api/v1/user/:id
  //@Access: private ['admin']
  @Patch(':id')
  @Roles(['admin'])
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      status: 200,
      data: await this.userService.update(id, updateUserDto),
    };
  }
  //@Desc: This method will delete user by id
  //@Route: DELETE /api/v1/user/:id
  //@Access: private ['admin']
  @Delete(':id')
  @Roles(['admin'])
  async remove(@Param('id') id: string, @Req() req) {
    await this.userService.remove(id, req.user);
    return {
      status: 200,
      message: 'user has been delete',
    };
  }
}

//=================================================For users================================================//
@Controller('userMe')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseGuards(AuthGuard, RolesGuard)
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  //@Desc: This method will let user return his information
  //@Route: GET /api/v1/user/me
  //@Access: private ['user']
  @Get('')
  @Roles(['user'])
  getUserMe(@Req() req) {
    return this.userService.getUserMe(req.user);
  }

  //@Desc: This method will let user return his information
  //@Route: GET /api/v1/user/me
  //@Access: private ['user']
  @Patch('')
  @Roles(['user'])
  updateUserMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserMe(req.user, updateUserDto);
  }

  //@Desc: This method will let user return his information
  //@Route: GET /api/v1/user/me
  //@Access: private ['user']
  @Delete('')
  @Roles(['user'])
  deleteUserMe(@Req() req) {
    return this.userService.deleteUserMe(req.user);
  }
}

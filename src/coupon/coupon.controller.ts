import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  //@Desc: Create a new coupon
  //@Route: POST /coupon
  //@Access: Admin
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  //@Desc: Get all coupons
  //@Route: GET /coupon
  //@Access: private ['admin']
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  findAll() {
    return this.couponService.findAll();
  }

  //@Desc: Get a single coupon by ID
  //@Route: GET /coupon/:id
  //@Access: Public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  //@Desc: Update a coupon by ID
  //@Route: PATCH /coupon/:id
  //@Access: Admin
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(id, updateCouponDto);
  }

  //@Desc: Delete a coupon by ID
  //@Route: DELETE /coupon/:id
  //@Access: Admin
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}

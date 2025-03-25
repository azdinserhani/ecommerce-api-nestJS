import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './coupon.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}
  private async validateCouponId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const category = await this.couponModel.findById(id);
    if (!category) {
      throw new NotFoundException();
    }
  }
  // Create a new coupon
  async create(createCouponDto: CreateCouponDto) {
    try {
      const createdCoupon = await this.couponModel.create(createCouponDto);
      return {
        status: 200,
        message: 'Coupon created successfully',
        data: createdCoupon,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Coupon already exists');
      }
      console.log(error);

      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll() {
    const coupons = await this.couponModel.find().select('-__v');
    return {
      status: 200,
      length: coupons.length,
      data: coupons,
    };
  }

  async findOne(id: string) {
    await this.validateCouponId(id);
    const coupon = await this.couponModel.findById(id).select('-__v');
    return {
      status: 200,
      data: coupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    await this.validateCouponId(id);
    const updatedCoupon = await this.couponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: string) {
    await this.validateCouponId(id);
    await this.couponModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Coupon deleted successfully',
    };
  }
}

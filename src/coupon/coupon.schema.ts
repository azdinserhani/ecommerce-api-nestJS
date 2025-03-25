import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type couponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({
    unique: true,
    required: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [6, 'Name must not exceed 6 characters'],
  })
  name: string;

  @Prop({ required: true, type: Date })
  expireDate: Date;

  @Prop({
    required: true,
    type: Number,
    min: [1, 'Discount must be at least 1%'],
    max: [100, 'Discount must not exceed 100%'],
  })
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

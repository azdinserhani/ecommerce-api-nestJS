import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type cartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart {
  @Prop([
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: Product.name,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      color: {
        type: String,
        required: false,
      },
    },
  ])
  cartItems: {
    productId: string;
    quantity: number;
    color?: string;
  }[];

  @Prop({
    type: Number,
  })
  totalPrice: number;

  @Prop({
    type: Number,
  })
  totalPriceAfterDiscount: number;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Coupon.name,
  })
  coupons: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: User.name,
  })
  user: string;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

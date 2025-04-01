import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/subCategory.schema';

export type productDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: String, minlength: 3, required: true, unique: true })
  title: string;

  @Prop({ type: String, minlength: 20, required: true })
  description: string;

  @Prop({ type: Number, min: 3, max: 500, required: true, default: 1 })
  quantity: number;

  @Prop({ type: String, required: true })
  imageCover: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop({ type: Number, default: 0 })
  sold: number;

  @Prop({ type: Number, required: true, min: 1, max: 20000 })
  price: number;

  @Prop({ type: Number, max: 20000, default: 0 })
  priceAfterDiscount: number;
  @Prop({ type: [String] })
  colors: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: SubCategory.name,
  })
  subCategory: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand.name,
  })
  brand: string;

  @Prop({ type: Number, default: 0 })
  ratingsAverage: number;

  @Prop({ type: Number, default: 0 })
  ratingsQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

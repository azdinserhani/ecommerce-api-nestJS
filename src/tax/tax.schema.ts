import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type taxDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax {
  @Prop({ type: Number ,default: 0})
  taxPrice: number;
  @Prop({ type: Number ,default: 0})
  shippingPrice: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);

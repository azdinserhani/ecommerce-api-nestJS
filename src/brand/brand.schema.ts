import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    type: String,
    required: true,
    min: [3, 'name must to be at least 3 character'],
    max: [30, 'name must to be at less than 30 character'],
    unique: true,
  })
  name: string;

  @Prop({ type: String })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

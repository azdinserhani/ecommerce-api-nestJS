import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
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

export const CategorySchema = SchemaFactory.createForClass(Category);

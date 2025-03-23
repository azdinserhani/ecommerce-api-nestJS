import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/category.schema';
export type subCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    min: [3, 'name must to be at least 3 character'],
    max: [30, 'name must to be at less than 30 character'],
    unique: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: string;
}

export const subCategorySchema = SchemaFactory.createForClass(SubCategory);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type supplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ type: String, required: true, unique: true,maxlength: 30, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  website: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RequestProductDocument = HydratedDocument<RequestProduct>;

@Schema({ timestamps: true })
export class RequestProduct {
  @Prop({ type: String, required: true })
  titleNeeded: string;

  @Prop({
    type: String,
    required: true,
    minlength: [5, 'details must to be at least 5 character'],
  })
  details: string;

  @Prop({
    type: Number,
    required: true,
    min: [1, 'quantity must to be at least 1'],
  })
  quantity: number;

  @Prop({ type: String })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
}

export const RequestProductSchema =
  SchemaFactory.createForClass(RequestProduct);

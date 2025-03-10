import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    min: [3, 'name must to be at least 3 character'],
    max: [30, 'name must to be at less than 30 character'],
  })
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({
    required: true,
    min: [3, 'password must to be at least 3 character'],
    max: [20, 'password must to be at less than 30 character'],
  })
  password: string;

  @Prop({ enum: ['Admin', 'user'] })
  role: string;

  avatar: string;

  age: number;

  phone: number;

  address: string;

  active: boolean;

  verificationCode: string;

  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

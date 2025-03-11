import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    min: [3, 'name must to be at least 3 character'],
    max: [30, 'name must to be at less than 30 character'],
  })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    min: [3, 'password must to be at least 3 character'],
    max: [20, 'password must to be at less than 30 character'],
  })
  password: string;

  @Prop({ required: true, type: String, enum: ['Admin', 'user'] })
  role: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: Boolean, enum: [false, true] })
  active: boolean;

  @Prop({ type: String })
  verificationCode: string;

  @Prop({ type: String, enum: ['male', 'female'] })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next(); // Hash only if password is modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Middleware to log after saving
UserSchema.post<UserDocument>('save', function (doc) {
  console.log(`User ${doc.email} has been created`);
});

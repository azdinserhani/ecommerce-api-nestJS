import { Module } from '@nestjs/common';
import { RequestProductService } from './request_product.service';
import { RequestProductController } from './request_product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestProduct, RequestProductSchema } from './requestProduct.schema';
import { User, UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestProduct.name, schema: RequestProductSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [RequestProductController],
  providers: [RequestProductService],
})
export class RequestProductModule {}

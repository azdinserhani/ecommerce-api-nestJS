import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { Supplier, SupplierSchema } from './suppliers.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
    ]),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}

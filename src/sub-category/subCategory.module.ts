import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { subCategoryController } from './subCategory.controller';
import { SubCategoryService } from './subCategory.service';
import { SubCategory, subCategorySchema } from './subCategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: subCategorySchema },
    ]),
  ],
  controllers: [subCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}

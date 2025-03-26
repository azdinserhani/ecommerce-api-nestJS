import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { subCategoryController } from './subCategory.controller';
import { SubCategoryService } from './subCategory.service';
import { SubCategory, subCategorySchema } from './subCategory.schema';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: subCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [subCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/subCategory.schema';
import { Brand } from 'src/brand/brand.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const {
        category: categoryId,
        subCategory: subCategoryId,
        brand: brandId,
      } = createProductDto;

      // Validate category
      const category = await this.categoryModel.findById(categoryId);
      if (!category) {
        throw new BadRequestException('Invalid category ID');
      }

      // Validate sub-category if provided
      let subCategory = null;
      if (subCategoryId) {
        subCategory = await this.subCategoryModel.findById(subCategoryId);
        if (!subCategory) {
          throw new BadRequestException('Invalid sub-category ID');
        }
      }

      // Validate brand if provided
      let brand = null;
      if (brandId) {
        brand = await this.brandModel.findById(brandId);
        if (!brand) {
          throw new BadRequestException('Invalid brand ID');
        }
      }

      // Create and save the product
      const product = await this.productModel.create({
        ...createProductDto,
        category: categoryId,
        subCategory: subCategoryId,
        brand: brandId,
      });

      return {
        status: 200,
        message: 'product has been created',
        data: product,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('this product is already exist');
      }
      throw new BadRequestException();
    }
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

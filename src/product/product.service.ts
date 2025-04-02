import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.schema';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/subCategory.schema';
import { Brand } from 'src/brand/brand.schema';
import { GetProductsQueryDto } from 'src/product/dto/getProduct.dto';

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

  async findAll(query: GetProductsQueryDto) {
    const { offset = 0, limit = 10, priceGte, priceLte, title } = query;
    const filter: any = {};

    // Filter by price range
    if (priceGte !== undefined || priceLte !== undefined) {
      filter.price = {};
      if (priceGte !== undefined) {
        filter.price.$gte = priceGte;
      }
      if (priceLte !== undefined) {
        filter.price.$lte = priceLte;
      }
    }

    // Filter by title
    if (title) {
      filter.title = new RegExp(title.trim(), 'i');
    }

    const total = await this.productModel.countDocuments(filter); // Total count for pagination
    const products = await this.productModel
      .find(filter)
      .skip(offset)
      .limit(limit)
      .select(['-__v']);

    return {
      status: 200,
      total,
      length: products.length,
      page: Math.floor(offset / limit) + 1,
      data: products,
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    return {
      status: 200,
      message: 'product found succuss',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'product has been updated',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    await this.productModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'product has been deleted',
    };
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  private async validateCategoryId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException();
    }
  }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const createdCategory =
        await this.categoryModel.create(createCategoryDto);
      return {
        status: 200,
        message: 'category created succuss',
        data: createdCategory,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Category already in use');
      }
    }
  }

  async findAll() {
    const categories = await this.categoryModel.find();
    return {
      status: 200,
      length: categories.length,
      data: categories,
    };
  }

  async findOne(id: string) {
    await this.validateCategoryId(id);
    const category = await this.categoryModel.findById(id);
    return {
      status: 200,
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.validateCategoryId(id);
    await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
    });
    return {
      status: 200,
      message: 'category updated succuss',
    };
  }

  async remove(id: string) {
    await this.validateCategoryId(id);
    await this.categoryModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'category has been delete',
    };
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory } from './subCategory.schema';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { CategoryModule } from 'src/category/category.module';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  private async validateSubCategoryId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const subCategory = await this.subCategoryModel.findById(id);
    if (!subCategory) {
      throw new NotFoundException();
    }
  }
  async create(createSubCategoryDto: CreateSubCategoryDto) {
    const category = await this.categoryModel.findById(
      createSubCategoryDto.category,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    try {
      const createdSubCategory = await (
        await this.subCategoryModel.create(createSubCategoryDto)
      ).populate('category', '-_id -__v');
      return {
        status: 200,
        message: 'subCategory created succuss',
        data: createdSubCategory,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('subCategory already in use');
      }
    }
  }

  async findAll() {
    const subCategories = await this.subCategoryModel
      .find()
      .select('-__v')
      .populate('category', '-_id -__v');
    return {
      status: 200,
      length: subCategories.length,
      isEmpty: subCategories.length > 0 ? 'false' : 'true',
      data: subCategories,
    };
  }

  async findOne(id: string) {
    await this.validateSubCategoryId(id);
    const subCategory = await this.subCategoryModel
      .findById(id)
      .populate('category', '-_id -__v');
    return {
      status: 200,
      data: subCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    await this.validateSubCategoryId(id);
    const updatedSubCategory = await this.subCategoryModel
      .findByIdAndUpdate(id, updateSubCategoryDto, {
        new: true,
      })
      .select('-__v')
      .populate('category', '-_id -__v');
    return {
      status: 200,
      message: 'category updated succuss',
      data: updatedSubCategory,
    };
  }

  async remove(id: string) {
    await this.validateSubCategoryId(id);
    await this.subCategoryModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'category has been delete',
    };
  }
}

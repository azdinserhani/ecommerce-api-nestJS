import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  // Validate brand id
  private async validateBrandId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const category = await this.brandModel.findById(id);
    if (!category) {
      throw new NotFoundException();
    }
  }

  // Create a brand
  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = await this.brandModel.create(createBrandDto);
      return {
        status: 200,
        message: 'Brand created successfully',
        data: brand,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Brand already exists');
      }
    }
  }

  // Find all brands
  async findAll() {
    const brands = await this.brandModel.find();
    return {
      status: 200,
      message: 'All brands',
      length: brands.length,
      data: brands,
    };
  }

  // Find one brand
  async findOne(id: string) {
    await this.validateBrandId(id);
    const brand = await this.brandModel.findById(id);
    return {
      status: 200,
      message: 'Brand found',
      data: brand,
    };
  }

  // Update a brand
  async update(id: string, updateBrandDto: UpdateBrandDto) {
    await this.validateBrandId(id);
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(id, updateBrandDto, { new: true })
      .select('-__v');
    return {
      status: 200,
      message: 'Brand updated successfully',
      data: updatedBrand,
    };
  }

  // Remove a brand
 async remove(id: string) {
    await this.validateBrandId(id);
    await this.brandModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Brand deleted successfully',
    };
  }
}

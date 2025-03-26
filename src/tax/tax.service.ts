import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { Tax } from './tax.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TaxService {
  constructor(@InjectModel(Tax.name) private taxModel: Model<Tax>) {}

  async createOrUpdate(createTexDto: CreateTaxDto) {
    const tex = await this.taxModel.findOne({});
    if (!tex) {
      // Create New Tax
      const newTex = await this.taxModel.create(createTexDto);
      return {
        status: 200,
        message: 'Tax created successfully',
        data: newTex,
      };
    }
    // Update Tax
    const updateTex = await this.taxModel
      .findOneAndUpdate({}, createTexDto, {
        new: true,
      })
      .select('-__v');
    return {
      status: 200,
      message: 'Tax Updated successfully',
      data: updateTex,
    };
  }
  // Create a Tax
  // async create(createTaxDto: CreateTaxDto) {
  //   try {
  //     const Tax = await this.taxModel.create(createTaxDto);
  //     return {
  //       status: 200,
  //       message: 'Tax created successfully',
  //       data: Tax,
  //     };
  //   } catch (error) {
  //     if (error.code === 11000) {
  //       throw new ConflictException('Tax already exists');
  //     }
  //   }
  // }

  // Find all Tax
  async findAll() {
    const taxes = await this.taxModel.find();
    return {
      status: 200,
      length: taxes.length,
      data: taxes,
    };
  }

  async reset() {
    await this.taxModel.findOneAndUpdate({}, { taxPrice: 0, shippingPrice: 0 });
    return {
      status: 200,
      message: 'Tax reset successfully',
    };
  }
}

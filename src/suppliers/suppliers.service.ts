import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './suppliers.schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {}

  // Validate supplier id
  private async validateSupplierId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const category = await this.supplierModel.findById(id);
    if (!category) {
      throw new NotFoundException();
    }
  }

  // Create a supplier
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const supplier = await this.supplierModel.create(createSupplierDto);
      return {
        status: 200,
        message: 'Supplier created successfully',
        data: supplier,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Supplier already exists');
      }
    }
  }

  // Find all suppliers
  async findAll() {
    const suppliers = await this.supplierModel.find();
    return {
      status: 200,
      length: suppliers.length,
      data: suppliers,
    };
  }

  // Find one supplier
  async findOne(id: string) {
    await this.validateSupplierId(id);
    const supplier = await this.supplierModel.findById(id);
    return {
      status: 200,
      data: supplier,
    };
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.validateSupplierId(id);
    const supplier = await this.supplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'Supplier updated successfully',
      data: supplier,
    };
  }

  async remove(id: string) {
    await this.validateSupplierId(id);
    await this.supplierModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Supplier deleted successfully',
    };
  }
}

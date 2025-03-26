import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestProductDto } from './dto/create-request_product.dto';
import { UpdateRequestProductDto } from './dto/update-request_product.dto';
import { isValidObjectId, Model } from 'mongoose';
import { RequestProduct } from './requestProduct.schema';
import { InjectModel } from '@nestjs/mongoose';
import { stat } from 'fs';
import { User } from 'src/user/user.schema';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProduct.name)
    private reqProductModel: Model<RequestProduct>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  private async validateReqProductId(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }
    const subCategory = await this.reqProductModel.findById(id);
    if (!subCategory) {
      throw new NotFoundException();
    }
  }

  // Create a new request product
  async create(createRequestProductDto: CreateRequestProductDto) {
    if (createRequestProductDto.user) {
      const user = await this.userModel.findById(createRequestProductDto.user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }
    const createdRequestProduct = await (
      await this.reqProductModel.create(createRequestProductDto)
    ).populate('user', 'name email');
    return {
      status: 200,
      message: 'Request Product created successfully',
      data: createdRequestProduct,
    };
  }

  async findAll() {
    const requestProducts = await this.reqProductModel
      .find()
      .select('-__v')
      .populate('user', 'name email');
    return {
      status: 200,
      message: 'Request Products fetched successfully',
      length: requestProducts.length,
      data: requestProducts,
    };
  }

  async findOne(id: string) {
    await this.validateReqProductId(id);
    const requestProduct = await this.reqProductModel
      .findById(id)
      .select('-__v');
    return {
      status: 200,
      message: 'Request Product fetched successfully',
      data: requestProduct,
    };
  }

  async update(id: string, updateRequestProductDto: UpdateRequestProductDto) {
    await this.validateReqProductId(id);
    const updatedRequestProduct = await this.reqProductModel.findByIdAndUpdate(
      id,
      updateRequestProductDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'Request Product updated successfully',
      data: updatedRequestProduct,
    };
  }

  async remove(id: string) {
    await this.validateReqProductId(id);
    const deletedRequestProduct =
      await this.reqProductModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Request Product deleted successfully',
      data: deletedRequestProduct,
    };
  }
}

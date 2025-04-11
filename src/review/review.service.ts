import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Product } from 'src/product/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<Review>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createReviewDto: CreateReviewDto, payload) {
    if (!payload?._id) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productModel.findById(createReviewDto.product);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = await this.reviewModel.create({
      ...createReviewDto,
      user: payload._id,
    });
    const { __v, ...result } = review.toObject();
    return {
      status: 201,
      message: 'Review created successfully',
      data: result,
    };
  }
  async update(id: string, updateReviewDto: UpdateReviewDto, payload) {
    if (!payload?._id) {
      throw new NotFoundException('User not found');
    }
    const findReview = await this.reviewModel.findById(id);
    if (!findReview) {
      throw new NotFoundException('Review not found');
    }
    if (findReview.user.toString() !== payload._id) {
      throw new NotFoundException(
        'You are not authorized to update this review',
      );
    }
    if (updateReviewDto.product) {
      throw new BadRequestException("You can't update product id");
    }
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(id, {
        ...updateReviewDto,
      })
      .select('-__v -createdAt -updatedAt');

    return {
      status: 200,
      message: 'Review updated successfully',
      data: updatedReview,
    };
  }

  async delete(id: string, payload) {
    if (!payload?._id) {
      throw new NotFoundException('User not found');
    }
    const findReview = await this.reviewModel.findById(id);
    if (!findReview) {
      throw new NotFoundException('Review not found');
    }
    if (findReview.user.toString() !== payload._id) {
      throw new NotFoundException(
        'You are not authorized to delete this review',
      );
    }
    await this.reviewModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Review deleted successfully',
    };
  }

  async getAll() {
    const reviews = await this.reviewModel
      .find()
      .populate({ path: 'user', select: '-password -__v' })
      .populate({ path: 'product', select: '-__v' });
    return {
      status: 200,
      message: 'All reviews',
      length: reviews.length,
      data: reviews,
    };
  }
  async getByProductId(productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const findReviews = await this.reviewModel
      .find({ product: productId })
      .populate({ path: 'user', select: '-password -__v' })
      .populate({ path: 'product', select: '-__v' });
    if (!findReviews) {
      throw new NotFoundException('Reviews not found');
    }
    return {
      status: 200,
      message: 'Reviews by product id',
      length: findReviews.length,
      data: findReviews,
    };
  }
  async getReviewsSingleUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const findReviews = await this.reviewModel
      .find({ user: userId })
      .populate({ path: 'user', select: '-password -__v' })
      .populate({ path: 'product', select: '-__v' });
    if (!findReviews) {
      throw new NotFoundException('Reviews not found');
    }
    return {
      status: 200,
      message: 'Reviews by user id',
      length: findReviews.length,
      data: findReviews,
    };
  }
}

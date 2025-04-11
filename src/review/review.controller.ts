import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('review')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@UseGuards(AuthGuard, RolesGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  //@Desc: This method will create a new review
  //@Route: POST /api/v1/review
  //@Access: private ['user', 'admin']
  @Roles(['user', 'admin'])
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req) {
    return this.reviewService.create(createReviewDto, req.user);
  }

  //@Desc: This method will update a review by id
  //@Route: PATCH /api/v1/review/:id
  //@Access: private ['admin', 'user']
  @Roles(['admin', 'user'])
  @Patch(':id')
  update(
    @Body() updateReviewDto: UpdateReviewDto,
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.reviewService.update(id, updateReviewDto, req.user);
  }

  //@Desc: This method will delete a review by id
  //@Route: DELETE /api/v1/review/:id
  //@Access: private ['admin', 'user']
  @Roles(['admin', 'user'])
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.reviewService.delete(id, req.user);
  }

  //@Desc: This method will return all reviews
  //@Route: GET /api/v1/review
  //@Access: private ['admin', 'user']
  @Roles(['admin', 'user'])
  @Get()
  getAll() {
    return this.reviewService.getAll();
  }

  //@Desc: This method will return reviews for a specific product
  //@Route: GET /api/v1/review/:productId
  //@Access: private ['admin']
  @Roles(['admin'])
  @Get(':productId')
  getByProductId(@Param('productId') productId: string) {
    return this.reviewService.getByProductId(productId);
  }

  //@Desc: This method will return reviews for a specific user
  //@Route: GET /api/v1/review/user/:userId
  //@Access: private ['admin']
  @Roles(['admin'])
  @Get('/user/:userId')
  getReviewsSingleUser(@Param('userId') userId: string) {
    return this.reviewService.getReviewsSingleUser(userId);
  }
}

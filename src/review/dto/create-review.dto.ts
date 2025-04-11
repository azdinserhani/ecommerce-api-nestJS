import {
  IsString,
  Length,
  IsUrl,
  IsOptional,
  MinLength,
  IsNumber,
  IsArray,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
export class CreateReviewDto {
  @IsString()
  @IsOptional()
  @Length(3, 500, { message: 'reviewText must be at most 500 characters long' })
  reviewText: string; // The text of the review, should be at least 3 characters long and no more than 500 characters.

  @IsNumber()
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  rating: number; // The rating given by the user, should be between 1 and 5.

  @IsMongoId({ message: 'product must be a valid mongo id' })
  @IsString()
  product: string; // The ID of the product being reviewed.
}

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
export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'title must be at list 3 character long' })
  title: string;

  @IsString()
  @MinLength(20, { message: 'description must be at list 20 character long' })
  description: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsUrl()
  imageCover: string;

  @IsOptional()
  @IsArray({ message: 'images must be an array' })
  @IsString({ each: true, message: 'each image must be a string' })
  images: string[];

  @IsOptional()
  sold: number;

  @IsNumber()
  @Min(1, { message: 'price must to more than 1' })
  @Max(20000, { message: 'price must to less than 20000' })
  price: number;

  @IsOptional()
  @Max(20000, { message: 'priceAfterDiscount must to less than 20000' })
  priceAfterDiscount: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'each color must be a string' })
  colors: string[];

  @IsString()
  @IsMongoId({ message: 'category must to be a valid mongo id' })
  category: string;

  @IsOptional()
  @IsMongoId({ message: 'subCategory must to be a valid mongo id' })
  subCategory: string;

  @IsOptional()
  @IsMongoId({ message: 'brand must to be a valid mongo id' })
  brand: string;

  @IsOptional()
  ratingsAverage: number;

  @IsOptional()
  ratingsQuantity: number;
}

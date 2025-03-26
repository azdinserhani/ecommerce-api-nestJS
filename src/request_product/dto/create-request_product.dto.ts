import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestProductDto {
  @IsString({ message: 'titleNeeded must be a string' })
  titleNeeded: string;

  @IsString({ message: 'details must be a string' })
  @MinLength(5, { message: 'details must be at least 5 characters' })
  details: string;

  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be at least 1' })
  quantity: number;

  @IsString({ message: 'category must be a string' })
  @IsOptional()
  category: string;

  @IsMongoId({ message: 'user must be a valid MongoDB ObjectId' })
  @IsOptional()
  user: string;
}

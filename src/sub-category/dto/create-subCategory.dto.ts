import {
  IsString,
  Length,
  IsUrl,
  IsOptional,
  IsMongoId,
} from 'class-validator';
export class CreateSubCategoryDto {
  @IsString({ message: 'name must be a string' })
  @Length(3, 30, {
    message: 'name must to be at least 3 character and less than 30 character',
  })
  name: string;

  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'category must be a mongo id' })
  category: string;
}

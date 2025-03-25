import { IsString, Length, IsUrl, IsOptional } from 'class-validator';
export class CreateBrandDto {
  @IsString({ message: 'name must be a string' })
  @Length(3, 30, {
    message: 'name must to be at least 3 character and less than 30 character',
  })
  name: string;

  @IsString({ message: 'image must be a string' })
  @IsUrl()
  @IsOptional()
  image: string;
}

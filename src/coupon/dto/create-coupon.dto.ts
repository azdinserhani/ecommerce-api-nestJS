import { Type } from 'class-transformer';
import {
    IsString,
    IsDate,
    IsNumber,
    Min,
    Max,
    Length,
    IsNotEmpty,
} from 'class-validator';

export class CreateCouponDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters.' })
  name: string;

  @IsDate({ message: 'Expire date must be a valid date.' })
  @IsNotEmpty({ message: 'Expire date is required.' })
  @Type(() => Date)
  expireDate: Date;

  @IsNumber({}, { message: 'Discount must be a number.' })
  @Min(0, { message: 'Discount must be at least 0.' })
  @Max(100, { message: 'Discount must not exceed 100.' })
  discount: number;
}

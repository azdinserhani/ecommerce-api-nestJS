import {
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsMongoId,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItems: CartItemDto[];

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsNumber()
  totalPriceAfterDiscount?: number;

  @IsOptional()
  @IsString()
  coupons?: string;

  @IsMongoId()
  user: string;
}

import { IsOptional } from 'class-validator';

export class CreateTaxDto {
  @IsOptional()
  taxPrice: number;

  @IsOptional()
  shippingPrice: number;
}

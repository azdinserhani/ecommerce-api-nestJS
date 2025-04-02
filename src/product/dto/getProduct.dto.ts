import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsQueryDto {
    @IsOptional()
    @IsString()
    title?: string;



    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    priceGte?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    priceLte?: number;
}

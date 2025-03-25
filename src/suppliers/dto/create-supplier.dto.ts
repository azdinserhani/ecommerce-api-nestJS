import { IsString, MaxLength, IsOptional, IsUrl } from 'class-validator';

export class CreateSupplierDto {
    @IsString()
    @MaxLength(30, { message: 'Name is too long. Maximum length is 30 characters.' })
    name: string;

    @IsOptional()
    @IsUrl({}, { message: 'Website must be a valid URL.' })
    website: string;
}

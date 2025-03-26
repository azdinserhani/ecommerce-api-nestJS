import { PartialType } from '@nestjs/mapped-types';
import { CreateRequestProductDto } from './create-request_product.dto';

export class UpdateRequestProductDto extends PartialType(CreateRequestProductDto) {}

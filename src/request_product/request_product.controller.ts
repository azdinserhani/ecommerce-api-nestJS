import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RequestProductService } from './request_product.service';
import { CreateRequestProductDto } from './dto/create-request_product.dto';
import { UpdateRequestProductDto } from './dto/update-request_product.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  @Post()
  create(@Body() createRequestProductDto: CreateRequestProductDto) {
    return this.requestProductService.create(createRequestProductDto);
  }

  @Get()
  findAll() {
    return this.requestProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestProductService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
  ) {
    return this.requestProductService.update(id, updateRequestProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestProductService.remove(id);
  }
}

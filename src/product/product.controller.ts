import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { query } from 'express';
import { GetProductsQueryDto } from 'src/product/dto/getProduct.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';

@Controller('product')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //@Desc: This method will create a product
  //@Route: POST /api/v1/product
  //@Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  //@Desc: This method will get all the product
  //@Route: GET /api/v1/product
  //@Access: public
  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productService.findAll(query);
  }

  //@Desc: This method will get a product by id
  //@Route: Get /api/v1/product/:id
  //@Access: public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  //@Desc: This method will update a product
  //@Route: PATCH /api/v1/product/:id
  //@Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  //@Desc: This method will delete a product by id
  //@Route: DELETE /api/v1/product/:id
  //@Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}

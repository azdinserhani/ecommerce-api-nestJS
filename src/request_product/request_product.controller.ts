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
  UseGuards,
  Req,
} from '@nestjs/common';
import { RequestProductService } from './request_product.service';
import { CreateRequestProductDto } from './dto/create-request_product.dto';
import { UpdateRequestProductDto } from './dto/update-request_product.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { RolesGuard } from 'src/user/guard/roles.guard';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}

  //@Desc: This method will create a request product
  //@Route: POST /api/v1/request-product
  //@Access: private ['user']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['user'])
  @Post()
  create(@Body() createRequestProductDto: CreateRequestProductDto, @Req() req) {
    createRequestProductDto.user = req.user._id;
    return this.requestProductService.create(createRequestProductDto);
  }

  // @Desc: This method will return all the request product
  // @Route: GET /api/v1/request-product
  // @Access private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get()
  findAll() {
    return this.requestProductService.findAll();
  }

  // @Desc: This method will return all the request product
  // @Route: GET /api/v1/request-product
  // @Access private user in the system that have an account
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestProductService.findOne(id);
  }

  // @Desc: This method will update request product by id
  // @Route: PATCH /api/v1/request-product/:id
  // @Access: private ['user']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['user'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @Req() req,
  ) {
    return this.requestProductService.update(
      id,
      updateRequestProductDto,
      req.user._id,
    );
  }

  // @Desc: This method will remove request product by id
  // @Route: PATCH /api/v1/request-product/:id
  // @Access: private ['user']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['user'])
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.requestProductService.remove(id, req.user._id);
  }
}

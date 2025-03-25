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
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  //@Desc: This method will create a brand
  //@Route: POST /api/v1/brand
  //@Access: private ['admin']
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  //@Desc: This method will get all brands
  //@Route: GET /api/v1/brand
  //@Access: public
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  //@Desc: This method will get one brands
  //@Route: GET /api/v1/brand/:id
  //@Access: public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  //@Desc: This method will update brands
  //@Route: PATCH /api/v1/brand/:id
  //@Access: private ['admin']
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  //@Desc: This method will remove brands
  //@Route: DELETE /api/v1/brand/:id
  //@Access: private ['admin']
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.brandService.remove(id);
  }
}

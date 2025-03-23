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
} from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';

import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';

@Controller('sub-category')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class subCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  //@Desc: This method will create a subCategory
  //@Route: POST /api/v1/subCategory
  //@Access: private ['admin']
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  create(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  //@Desc: This method will return all the subCategory
  //@Route: GET /api/v1/subCategory
  //@Access: public
  @Get()
  findAll() {
    return this.subCategoryService.findAll();
  }

  // @Desc: This method will return subCategory by id
  // @Route: GET /api/v1/subCategory/:id
  // @Access: public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  // @Desc: This method will update subCategory by id
  // @Route: PATCH /api/v1/subCategory/:id
  // @Access: private ['admin']
  @Patch(':id')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  // @Desc: This method will remove subCategory by id
  // @Route: DELETE /api/v1/subCategory/:id
  // @Access: private ['admin']
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}

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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('category')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //@Desc: This method will create a category
  //@Route: POST /api/v1/category
  //@Access: private ['admin']
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  //@Desc: This method will return all the category
  //@Route: GET /api/v1/category
  //@Access: public
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  // @Desc: This method will return category by id
  // @Route: GET /api/v1/category/:id
  // @Access: public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  // @Desc: This method will update category by id
  // @Route: PATCH /api/v1/category/:id
  // @Access: private ['admin']
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  // @Desc: This method will remove category by id
  // @Route: DELETE /api/v1/category/:id
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}

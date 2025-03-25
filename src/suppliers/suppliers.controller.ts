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
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('supplier')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  // @Desc: This method will create a supplier
  // @Route: POST /api/v1/suppliers
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  // @Desc: This method will get all suppliers
  // @Route: GET /api/v1/suppliers
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  // @Desc: This method will get a supplier by id
  // @Route: GET /api/v1/suppliers/:id
  // @Access: public
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  // @Desc: This method will create a supplier
  // @Route: PATCH /api/v1/suppliers
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  // @Desc: This method will delete a supplier
  // @Route: DELETE /api/v1/suppliers/:id
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}

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
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { RolesGuard } from 'src/user/guard/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('Tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  // @Desc: This method will create or update a Tax
  // @Route: POST /api/v1/tax/create-update
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Post('/create-update')
  update(@Body() createTaxDto: CreateTaxDto) {
    return this.taxService.createOrUpdate(createTaxDto);
  }

  // @Desc: This method will get Tax
  // @Route: GET /api/v1/tax
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get()
  findAll() {
    return this.taxService.findAll();
  }

  // @Desc: This method will reset the Tax
  // @Route: DELETE /api/v1/tax
  // @Access: private ['admin']
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Delete()
  remove() {
    return this.taxService.reset();
  }
}

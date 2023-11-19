import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';
import { TiendaDto } from './tienda.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('stores')
export class TiendaController {
  constructor(private readonly tiendaServices: TiendaService) {}

  @Get()
  async findAll() {
    return await this.tiendaServices.findAll();
  }
  @Get(':tiendaId')
  async findOne(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaServices.findOne(tiendaId);
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaServices.create(tienda);
  }

  @Put(':tiendaId')
  async update(
    @Param('tiendaId') tiendaId: string,
    @Body() tiendaDto: TiendaDto,
  ) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaServices.update(tiendaId, tienda);
  }
  @Delete(':tiendaId')
  @HttpCode(204)
  async delete(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaServices.delete(tiendaId);
  }
}

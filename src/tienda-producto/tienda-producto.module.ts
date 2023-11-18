import { Module } from '@nestjs/common';
import { TiendaProductoService } from './tienda-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaEntity } from 'src/tienda/tienda.entity';

@Module({
  providers: [TiendaProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
})
export class TiendaProductoModule {}

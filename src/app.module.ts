import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoModule } from './producto/producto.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto/producto.entity';
import { TiendaEntity } from './tienda/tienda.entity';
import { TiendaProductoModule } from './tienda-producto/tienda-producto.module';

@Module({
  imports: [
    TiendaModule,
    ProductoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'catalina',
      database: 'tienda',
      entities: [ProductoEntity, TiendaEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    TiendaProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

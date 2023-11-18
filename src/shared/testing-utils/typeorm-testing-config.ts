import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../../producto/producto.entity';
import { TiendaEntity } from '../../tienda/tienda.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    entities: [ProductoEntity, TiendaEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([ProductoEntity, TiendaEntity]),
];

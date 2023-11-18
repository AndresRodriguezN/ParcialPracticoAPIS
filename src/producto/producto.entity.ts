import { TiendaEntity } from '../tienda/tienda.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  precio: string;

  @Column()
  tipo: string;

  @ManyToMany(() => TiendaEntity, (receta) => receta.producto)
  receta: TiendaEntity[];
}

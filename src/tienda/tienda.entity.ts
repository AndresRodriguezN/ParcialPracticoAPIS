import { ProductoEntity } from '../producto/producto.entity';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TiendaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  ciudad: string;
  @Column()
  direccion: string;
  @ManyToMany(() => ProductoEntity, (producto) => producto.tienda)
  @JoinTable()
  producto: ProductoEntity[];
}

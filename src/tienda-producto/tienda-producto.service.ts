import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Injectable()
export class TiendaProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>
  ) {}

  async addProductoTienda(
    tiendaId: string,
    productoId: string,
  ): Promise<TiendaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto) {
      throw new BusinessLogicException(
        'El producto con el id indicado no fue encontrada', BusinessError.NOT_FOUND);}

    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
            where: { id: tiendaId },
      relations: ['producto'],
        });
        if (!tienda) {
      throw new BusinessLogicException('La receta con el id indicado no fue encontrado',BusinessError.NOT_FOUND);
        }

        tienda.producto.push(producto);

        return this.tiendaRepository.save(tienda);
    }

  async findProductosByTiendaId(
    tiendaId: string,
  ): Promise<Array<ProductoEntity>> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({
            where: { id: tiendaId },
            relations: ['producto'],
        });
        if (!tienda) {
            throw new BusinessLogicException('La receta con el id indicado no fue encontrado', BusinessError.NOT_FOUND);
        }
        return tienda.producto ?? [];
    }

    async deleteProductoTienda(tiendaId: string, productoId: string) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({
            where: { id: tiendaId },
            relations: ['producto'],
        });

        if (!tienda) {
            throw new BusinessLogicException('La receta con el id indicado no fue encontrado', BusinessError.NOT_FOUND);
        }

        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: productoId } });
        if (!producto) {
            throw new BusinessLogicException('El producto con el id indicado no fue encontrada', BusinessError.NOT_FOUND);
        }

        tienda.producto = tienda.producto.filter((producto) => producto.id !== productoId);
        return this.tiendaRepository.save(tienda);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) {}

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({
      relations: ['culturaGastronomica'],
    });
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const receta: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
      relations: ['producto'],
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id indicado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    return receta;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!persistedTienda)
      throw new BusinessLogicException(
        'La receta con el id indicado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    tienda.id = id;
    return await this.tiendaRepository.save(tienda);
  }

  async delete(id: string) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new BusinessLogicException(
        'La receta con el id indicado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    await this.tiendaRepository.remove(tienda);
  }
}

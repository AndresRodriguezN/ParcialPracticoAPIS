import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './tienda.entity';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
        direccion: faker.lorem.sentence(),
      });
      tiendaList.push(tienda);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll deberia retornar todos las tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendaList.length);
  });

  it('findOne deberia retornar una tienda por id', async () => {
    const storedTienda: TiendaEntity = tiendaList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
  });

  it('findOne deberia generar una exepcion si no existe la tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La tienda con el id indicado no fue encontrada',
    );
  });

  it('create deberia retornar una nueva tienda', async () => {
    const tienda: TiendaEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.lorem.sentence(),
      producto: [],
    };

    const nuevaTienda: TiendaEntity = await service.create(tienda);
    expect(nuevaTienda).not.toBeNull();

    const tiendaAlmacenado: TiendaEntity = await repository.findOne({
      where: { id: nuevaTienda.id },
    });
    expect(tiendaAlmacenado).not.toBeNull();
    expect(tiendaAlmacenado.nombre).toEqual(nuevaTienda.nombre);
  });

  it('update deberia actualizar una tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.nombre = 'Nuevo nombre';
    const tiendaActualizado: TiendaEntity = await service.update(
      tienda.id,
      tienda,
    );
    expect(tiendaActualizado).not.toBeNull();
    const tiendaAlmacenado: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(tiendaAlmacenado).not.toBeNull();
    expect(tiendaAlmacenado.nombre).toEqual(tienda.nombre);
  });

  it('update deberia generar una excepcion para una tienda no valida', async () => {
    let tienda: TiendaEntity = tiendaList[0];
    tienda = {
      ...tienda,
      nombre: 'Nuevo nombre',
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty(
      'message',
      'La tienda con el id indicado no fue encontrada',
    );
  });

  it('delete deberia borrar una tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);

    const tiendaBorrado: TiendaEntity = await repository.findOne({
      where: { id: tienda.id },
    });
    expect(tiendaBorrado).toBeNull();
  });

  it('delete deberia generar una excepcion para una tienda no valida', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La tienda con el id indicado no fue encontrada',
    );
  });
});

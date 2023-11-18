import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from './tienda.entity';
import { faker } from '@faker-js/faker';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetaList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        foto: faker.image.url(),
        procesoPreparacion: faker.lorem.sentence(),
        video: faker.image.url(),
      });
      recetaList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll deberia retornar todos las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetaList.length);
  });

  it('findOne deberia retornar una receta por id', async () => {
    const storedReceta: RecetaEntity = recetaList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre);
  });

  it('findOne deberia generar una exepcion si no existe la receta', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id indicado no fue encontrada',
    );
  });

  it('create deberia retornar una nueva receta', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      foto: faker.image.url(),
      procesoPreparacion: faker.lorem.sentence(),
      video: faker.image.url(),
      restaurante: [],
      culturaGastronomica: null,
      producto: [],
    };

    const nuevaReceta: RecetaEntity = await service.create(receta);
    expect(nuevaReceta).not.toBeNull();

    const recetaAlmacenado: RecetaEntity = await repository.findOne({
      where: { id: nuevaReceta.id },
    });
    expect(recetaAlmacenado).not.toBeNull();
    expect(recetaAlmacenado.nombre).toEqual(nuevaReceta.nombre);
  });

  it('update deberia actualizar una receta', async () => {
    const receta: RecetaEntity = recetaList[0];
    receta.nombre = 'Nuevo nombre';
    const recetaActualizado: RecetaEntity = await service.update(
      receta.id,
      receta,
    );
    expect(recetaActualizado).not.toBeNull();
    const recetaAlmacenado: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(recetaAlmacenado).not.toBeNull();
    expect(recetaAlmacenado.nombre).toEqual(receta.nombre);
  });

  it('update deberia generar una excepcion para una receta no valida', async () => {
    let receta: RecetaEntity = recetaList[0];
    receta = {
      ...receta,
      nombre: 'Nuevo nombre',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'La receta con el id indicado no fue encontrada',
    );
  });

  it('delete deberia borrar una receta', async () => {
    const receta: RecetaEntity = recetaList[0];
    await service.delete(receta.id);

    const recetaBorrado: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(recetaBorrado).toBeNull();
  });

  it('delete deberia generar una excepcion para una receta no valida', async () => {
    const receta: RecetaEntity = recetaList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id indicado no fue encontrada',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TiendaProductoService } from './tienda-producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from '../tienda/tienda.entity';

describe('TiendaProductoService', () => {
  let service: TiendaProductoService;
  let productoRepository: Repository<ProductoEntity>;
  let producto: ProductoEntity;
  let tiendaRepository: Repository<TiendaEntity>;
  let tienda: TiendaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaProductoService],
    }).compile();

    service = module.get<TiendaProductoService>(TiendaProductoService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.lorem.sentence(),
    });

    producto = await productoRepository.save({
      nombre: faker.company.name(),
      precio: faker.lorem.sentence(),
      tipo: faker.lorem.sentence(),
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoTienda deberia generar excepcion al no encontrar producto', async () => {
    await expect(() =>
      service.addProductoTienda(tienda.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id indicado no fue encontrada',
    );
  });

  it('addProductoTienda deberia generar excepción al no encontrar tienda', async () => {
    await expect(() =>
      service.addProductoTienda('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'La tienda con el id indicado no fue encontrado',
    );
  });

  it('addProductoTienda deberia relacionar el producto a la tienda', async () => {
    const result: TiendaEntity = await service.addProductoTienda(
      tienda.id,
      producto.id,
    );

    expect(result.producto).not.toBeNull();
    expect(result.producto[0].nombre).toBe(producto.nombre);
  });

  it('findProductoTienda deberia retornar los productos de una tienda', async () => {
    const nuevoTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.lorem.sentence(),
    });
    await service.addProductoTienda(nuevoTienda.id, producto.id);

    const productos: ProductoEntity[] = await service.findProductosByTiendaId(
      nuevoTienda.id,
    );
    expect(productos).not.toBeNull();
    expect(productos[0].nombre).toBe(producto.nombre);
  });

  it('deleteProductoTienda deberia eliminar el producto de la tienda', async () => {
    const nuevoTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
      direccion: faker.lorem.sentence(),
    });
    await service.addProductoTienda(nuevoTienda.id, producto.id);

    await service.deleteProductoTienda(nuevoTienda.id, producto.id);
    const result: TiendaEntity = await tiendaRepository.findOne({
      where: { id: nuevoTienda.id },
      relations: ['producto'],
    });
    expect(result.producto).toHaveLength(0);
  });
});

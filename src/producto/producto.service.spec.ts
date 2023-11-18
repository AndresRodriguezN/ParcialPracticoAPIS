import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence(),
      });
      productoList.push(producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productoList.length);
  });

  it('findOne deberia retornar un producto por id', async () => {
    const storedProducto: ProductoEntity = productoList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
  });

  it('findOne deberia generar una exepcion si no existe el producto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id indicado no fue encontrado',
    );
  });

  it('update deberia actualizar un producto', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.nombre = 'Nuevo nombre';
    const productoActualizado: ProductoEntity = await service.update(
      producto.id,
      producto,
    );
    expect(productoActualizado).not.toBeNull();
    const productoAlmacenado: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toEqual(producto.nombre);
  });

  it('update deberia generar una excepcion para un producto no valido', async () => {
    let producto: ProductoEntity = productoList[0];
    producto = {
      ...producto,
      nombre: 'Nuevo nombre',
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty(
      'message',
      'El producto con el id indicado no fue encontrado',
    );
  });

  it('delete deberia borrar un producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);

    const productoBorrado: ProductoEntity = await repository.findOne({
      where: { id: producto.id },
    });
    expect(productoBorrado).toBeNull();
  });

  it('delete deberia generar una excepcion para un producto no valido', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El producto con el id indicado no fue encontrado',
    );
  });
});

import { IsNotEmpty, IsString } from 'class-validator';
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
  @IsString()
  @IsNotEmpty()
  readonly historia: string;
}

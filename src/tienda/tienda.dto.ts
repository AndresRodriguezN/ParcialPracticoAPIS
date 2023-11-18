import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class TiendaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  @IsString()
  @IsNotEmpty()
  readonly ciudad: string;
  @IsUrl()
  @IsNotEmpty()
  readonly direccion: string;
}

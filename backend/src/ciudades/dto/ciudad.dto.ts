import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCiudadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  departamentoId: number;
}

export class UpdateCiudadDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsInt()
  departamentoId: number;
}

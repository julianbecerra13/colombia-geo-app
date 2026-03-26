import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartamentoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

export class UpdateDepartamentoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

import { Module } from '@nestjs/common';
import { CiudadesController } from './ciudades.controller';
import { CiudadesService } from './ciudades.service';

@Module({
  controllers: [CiudadesController],
  providers: [CiudadesService],
})
export class CiudadesModule {}

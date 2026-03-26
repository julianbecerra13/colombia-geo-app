import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { CiudadesModule } from './ciudades/ciudades.module';

@Module({
  imports: [PrismaModule, AuthModule, DepartamentosModule, CiudadesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

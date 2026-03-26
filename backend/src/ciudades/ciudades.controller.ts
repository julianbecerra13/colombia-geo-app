import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto, UpdateCiudadDto } from './dto/ciudad.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Ciudades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ciudades')
export class CiudadesController {
  constructor(private ciudadesService: CiudadesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  findAll() {
    return this.ciudadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ciudad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una ciudad' })
  create(@Body() dto: CreateCiudadDto) {
    return this.ciudadesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una ciudad' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCiudadDto) {
    return this.ciudadesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ciudad' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.remove(id);
  }
}

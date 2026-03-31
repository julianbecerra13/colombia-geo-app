import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Obtener ciudades con paginación y búsqueda' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por nombre' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.ciudadesService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
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
  @ApiOperation({ summary: 'Eliminar una ciudad (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.remove(id);
  }
}

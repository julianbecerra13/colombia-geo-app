import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DepartamentosService } from './departamentos.service';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from './dto/departamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Departamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departamentos')
export class DepartamentosController {
  constructor(private departamentosService: DepartamentosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener departamentos con paginación y búsqueda' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar por nombre' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.departamentosService.findAll(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un departamento por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departamentosService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un departamento' })
  create(@Body() dto: CreateDepartamentoDto) {
    return this.departamentosService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un departamento' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartamentoDto) {
    return this.departamentosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un departamento (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departamentosService.remove(id);
  }
}

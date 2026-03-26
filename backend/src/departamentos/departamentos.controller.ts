import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DepartamentosService } from './departamentos.service';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from './dto/departamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('departamentos')
export class DepartamentosController {
  constructor(private departamentosService: DepartamentosService) {}

  @Get()
  findAll() {
    return this.departamentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departamentosService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDepartamentoDto) {
    return this.departamentosService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartamentoDto) {
    return this.departamentosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departamentosService.remove(id);
  }
}

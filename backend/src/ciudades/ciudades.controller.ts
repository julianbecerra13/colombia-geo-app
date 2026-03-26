import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto, UpdateCiudadDto } from './dto/ciudad.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ciudades')
export class CiudadesController {
  constructor(private ciudadesService: CiudadesService) {}

  @Get()
  findAll() {
    return this.ciudadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCiudadDto) {
    return this.ciudadesService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCiudadDto) {
    return this.ciudadesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ciudadesService.remove(id);
  }
}

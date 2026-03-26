import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from './dto/departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.departamento.findMany({
      include: { ciudades: true },
    });
  }

  async findOne(id: number) {
    const departamento = await this.prisma.departamento.findUnique({
      where: { id },
      include: { ciudades: true },
    });

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    return departamento;
  }

  async create(dto: CreateDepartamentoDto) {
    return this.prisma.departamento.create({
      data: dto,
    });
  }

  async update(id: number, dto: UpdateDepartamentoDto) {
    await this.findOne(id);

    return this.prisma.departamento.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.departamento.delete({
      where: { id },
    });
  }
}

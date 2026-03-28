import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from './dto/departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.departamento.findMany({
      include: { ciudades: true },
      orderBy: { nombre: 'asc' },
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
    const existe = await this.prisma.departamento.findUnique({
      where: { nombre: dto.nombre },
    });

    if (existe) {
      throw new ConflictException('Ya existe un departamento con ese nombre');
    }

    return this.prisma.departamento.create({
      data: dto,
      include: { ciudades: true },
    });
  }

  async update(id: number, dto: UpdateDepartamentoDto) {
    await this.findOne(id);

    const existe = await this.prisma.departamento.findFirst({
      where: { nombre: dto.nombre, NOT: { id } },
    });

    if (existe) {
      throw new ConflictException('Ya existe un departamento con ese nombre');
    }

    return this.prisma.departamento.update({
      where: { id },
      data: dto,
      include: { ciudades: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.departamento.delete({
      where: { id },
    });
  }
}

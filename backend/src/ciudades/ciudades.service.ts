import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCiudadDto, UpdateCiudadDto } from './dto/ciudad.dto';

@Injectable()
export class CiudadesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ciudad.findMany({
      include: { departamento: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: number) {
    const ciudad = await this.prisma.ciudad.findUnique({
      where: { id },
      include: { departamento: true },
    });

    if (!ciudad) {
      throw new NotFoundException('Ciudad no encontrada');
    }

    return ciudad;
  }

  async create(dto: CreateCiudadDto) {
    const departamento = await this.prisma.departamento.findUnique({
      where: { id: dto.departamentoId },
    });

    if (!departamento) {
      throw new BadRequestException('El departamento seleccionado no existe');
    }

    return this.prisma.ciudad.create({
      data: dto,
      include: { departamento: true },
    });
  }

  async update(id: number, dto: UpdateCiudadDto) {
    await this.findOne(id);

    const departamento = await this.prisma.departamento.findUnique({
      where: { id: dto.departamentoId },
    });

    if (!departamento) {
      throw new BadRequestException('El departamento seleccionado no existe');
    }

    return this.prisma.ciudad.update({
      where: { id },
      data: dto,
      include: { departamento: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ciudad.delete({
      where: { id },
    });
  }
}

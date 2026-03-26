import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCiudadDto, UpdateCiudadDto } from './dto/ciudad.dto';

@Injectable()
export class CiudadesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ciudad.findMany({
      include: { departamento: true },
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
    return this.prisma.ciudad.create({
      data: dto,
      include: { departamento: true },
    });
  }

  async update(id: number, dto: UpdateCiudadDto) {
    await this.findOne(id);

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

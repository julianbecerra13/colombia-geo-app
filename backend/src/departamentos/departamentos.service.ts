import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartamentoDto, UpdateDepartamentoDto } from './dto/departamento.dto';

@Injectable()
export class DepartamentosService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const where: any = { deletedAt: null };

    if (search) {
      where.nombre = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.departamento.findMany({
        where,
        include: { ciudades: { where: { deletedAt: null } } },
        orderBy: { nombre: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.departamento.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const departamento = await this.prisma.departamento.findFirst({
      where: { id, deletedAt: null },
      include: { ciudades: { where: { deletedAt: null } } },
    });

    if (!departamento) {
      throw new NotFoundException('Departamento no encontrado');
    }

    return departamento;
  }

  async create(dto: CreateDepartamentoDto) {
    const existe = await this.prisma.departamento.findFirst({
      where: { nombre: dto.nombre, deletedAt: null },
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
      where: { nombre: dto.nombre, deletedAt: null, NOT: { id } },
    });

    if (existe) {
      throw new ConflictException('Ya existe un departamento con ese nombre');
    }

    return this.prisma.departamento.update({
      where: { id },
      data: dto,
      include: { ciudades: { where: { deletedAt: null } } },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.ciudad.updateMany({
      where: { departamentoId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    return this.prisma.departamento.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

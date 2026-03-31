import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCiudadDto, UpdateCiudadDto } from './dto/ciudad.dto';

@Injectable()
export class CiudadesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const where: any = { deletedAt: null };

    if (search) {
      where.nombre = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.ciudad.findMany({
        where,
        include: { departamento: true },
        orderBy: { nombre: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.ciudad.count({ where }),
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
    const ciudad = await this.prisma.ciudad.findFirst({
      where: { id, deletedAt: null },
      include: { departamento: true },
    });

    if (!ciudad) {
      throw new NotFoundException('Ciudad no encontrada');
    }

    return ciudad;
  }

  async create(dto: CreateCiudadDto) {
    const departamento = await this.prisma.departamento.findFirst({
      where: { id: dto.departamentoId, deletedAt: null },
    });

    if (!departamento) {
      throw new BadRequestException('El departamento seleccionado no existe');
    }

    const duplicada = await this.prisma.ciudad.findFirst({
      where: {
        nombre: dto.nombre,
        departamentoId: dto.departamentoId,
        deletedAt: null,
      },
    });

    if (duplicada) {
      throw new ConflictException(
        `Ya existe una ciudad "${dto.nombre}" en el departamento "${departamento.nombre}"`,
      );
    }

    return this.prisma.ciudad.create({
      data: dto,
      include: { departamento: true },
    });
  }

  async update(id: number, dto: UpdateCiudadDto) {
    await this.findOne(id);

    const departamento = await this.prisma.departamento.findFirst({
      where: { id: dto.departamentoId, deletedAt: null },
    });

    if (!departamento) {
      throw new BadRequestException('El departamento seleccionado no existe');
    }

    const duplicada = await this.prisma.ciudad.findFirst({
      where: {
        nombre: dto.nombre,
        departamentoId: dto.departamentoId,
        deletedAt: null,
        NOT: { id },
      },
    });

    if (duplicada) {
      throw new ConflictException(
        `Ya existe una ciudad "${dto.nombre}" en el departamento "${departamento.nombre}"`,
      );
    }

    return this.prisma.ciudad.update({
      where: { id },
      data: dto,
      include: { departamento: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.ciudad.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service.repository';
import { PrismaService } from '../../../shared/persistence/prisma.service';

@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) return null;
    return new Service(
      service.id,
      service.code,
      service.name,
      service.description,
      service.imageUrl,
      service.price,
      service.duration,
      service.createdAt,
      service.updatedAt,
    );
  }

  async findByCode(code: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({ where: { code } });
    if (!service) return null;
    return new Service(
      service.id,
      service.code,
      service.name,
      service.description,
      service.imageUrl,
      service.price,
      service.duration,
      service.createdAt,
      service.updatedAt,
    );
  }

  async findAll(): Promise<Service[]> {
    const services = await this.prisma.service.findMany();
    return services.map(
      (s) =>
        new Service(
          s.id,
          s.code,
          s.name,
          s.description,
          s.imageUrl,
          s.price,
          s.duration,
          s.createdAt,
          s.updatedAt,
        ),
    );
  }

  async save(service: Service): Promise<void> {
    await this.prisma.service.create({
      data: {
        id: service.id,
        code: service.code,
        name: service.name,
        description: service.description,
        imageUrl: service.imageUrl,
        price: service.price,
        duration: service.duration,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      },
    });
  }

  async update(service: Service): Promise<void> {
    await this.prisma.service.update({
      where: { id: service.id },
      data: {
        code: service.code,
        name: service.name,
        description: service.description,
        imageUrl: service.imageUrl,
        price: service.price,
        duration: service.duration,
        updatedAt: service.updatedAt,
      },
    });
  }
}

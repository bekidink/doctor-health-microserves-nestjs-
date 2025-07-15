import { Injectable } from '@nestjs/common';
import { Specialty } from '../../domain/entities/specialty.entity';
import { SpecialtyRepository } from '../../domain/interfaces/specialty.repository';
import { PrismaService } from '../../../shared/persistence/prisma.service';

@Injectable()
export class PrismaSpecialtyRepository implements SpecialtyRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Specialty | null> {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) return null;
    return new Specialty(
      specialty.id,
      specialty.name,
      specialty.description,
      specialty.imageUrl,
      specialty.createdAt,
      specialty.updatedAt,
    );
  }

  async findByName(name: string): Promise<Specialty | null> {
    const specialty = await this.prisma.specialty.findUnique({
      where: { name },
    });
    if (!specialty) return null;
    return new Specialty(
      specialty.id,
      specialty.name,
      specialty.description,
      specialty.imageUrl,
      specialty.createdAt,
      specialty.updatedAt,
    );
  }

  async findAll(): Promise<Specialty[]> {
    const specialties = await this.prisma.specialty.findMany();
    return specialties.map(
      (s) =>
        new Specialty(
          s.id,
          s.name,
          s.description,
          s.imageUrl,
          s.createdAt,
          s.updatedAt,
        ),
    );
  }

  async save(specialty: Specialty): Promise<void> {
    await this.prisma.specialty.create({
      data: {
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
        imageUrl: specialty.imageUrl,
        createdAt: specialty.createdAt,
        updatedAt: specialty.updatedAt,
      },
    });
  }

  async update(specialty: Specialty): Promise<void> {
    await this.prisma.specialty.update({
      where: { id: specialty.id },
      data: {
        name: specialty.name,
        description: specialty.description,
        imageUrl: specialty.imageUrl,
        updatedAt: specialty.updatedAt,
      },
    });
  }

  async assignToDoctor(specialtyId: string, doctorId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: doctorId },
      data: {
        specialties: {
          connect: { id: specialtyId },
        },
      },
    });
  }
}

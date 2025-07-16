import { Injectable } from '@nestjs/common';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';
import { PrismaService } from '../../../shared/persistence/prisma.service';
import { AppointmentStatus } from '../../domain/value-objects/appointment-status.vo';

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) return null;
    return new Appointment(
      appointment.id,
      appointment.patientId,
      appointment.doctorId,
      appointment.serviceId!,
      appointment.specialtyId!,
      appointment.startTime,
      appointment.endTime,
      appointment.status as AppointmentStatus,
      appointment.createdAt,
      appointment.updatedAt,
    );
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany();
    return appointments.map(
      (a) =>
        new Appointment(
          a.id,
          a.patientId,
          a.doctorId,
          a.serviceId!,
          a.specialtyId!,
          a.startTime,
          a.endTime,
          a.status as AppointmentStatus,
          a.createdAt,
          a.updatedAt,
        ),
    );
  }

  async findByDoctorAndTime(
    doctorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        OR: [
          { startTime: { gte: startTime, lte: endTime } },
          { endTime: { gte: startTime, lte: endTime } },
          { startTime: { lte: startTime }, endTime: { gte: endTime } },
        ],
        status: { not: 'CANCELED' },
      },
    });
    return appointments.map(
      (a) =>
        new Appointment(
          a.id,
          a.patientId,
          a.doctorId,
          a.serviceId!,
          a.specialtyId!,
          a.startTime,
          a.endTime,
          a.status as AppointmentStatus,
          a.createdAt,
          a.updatedAt,
        ),
    );
  }

  async save(appointment: Appointment): Promise<void> {
    await this.prisma.appointment.create({
      data: {
        id: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        serviceId: appointment.serviceId,
        specialtyId: appointment.specialtyId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    });
  }

  async update(appointment: Appointment): Promise<void> {
    await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        serviceId: appointment.serviceId,
        specialtyId: appointment.specialtyId,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        updatedAt: appointment.updatedAt,
      },
    });
  }
}

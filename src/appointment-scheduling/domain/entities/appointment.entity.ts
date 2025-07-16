import { AppointmentStatus } from '@prisma/client';
export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly serviceId: string,
    public readonly specialtyId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly status: AppointmentStatus,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}

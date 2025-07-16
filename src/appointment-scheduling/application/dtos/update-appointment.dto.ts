import { AppointmentStatus } from '@prisma/client';
export interface UpdateAppointmentDto {
  patientId?: string;
  doctorId?: string;
  serviceId?: string;
  specialtyId?: string;
  startTime?: Date;
  endTime?: Date;
  status?: AppointmentStatus;
}

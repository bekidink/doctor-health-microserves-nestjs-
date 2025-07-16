import { Appointment } from '../entities/appointment.entity';

export interface AppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findAll(): Promise<Appointment[]>;
  save(appointment: Appointment): Promise<void>;
  update(appointment: Appointment): Promise<void>;
  findByDoctorAndTime(
    doctorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Appointment[]>;
}

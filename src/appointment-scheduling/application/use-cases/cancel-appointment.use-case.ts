import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';
import { AppointmentNotFoundError } from '../../domain/errors/domain.error';
import {
  AppointmentStatus,
  AppointmentStatusVo,
} from '../../domain/value-objects/appointment-status.vo';

export class CancelAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new AppointmentNotFoundError(id);

    const updatedAppointment = new Appointment(
      appointment.id,
      appointment.patientId,
      appointment.doctorId,
      appointment.serviceId,
      appointment.specialtyId,
      appointment.startTime,
      appointment.endTime,
      new AppointmentStatusVo(AppointmentStatus.CANCELLED).value,
      appointment.createdAt,
      new Date(),
    );

    await this.appointmentRepository.update(updatedAppointment);
    return updatedAppointment;
  }
}

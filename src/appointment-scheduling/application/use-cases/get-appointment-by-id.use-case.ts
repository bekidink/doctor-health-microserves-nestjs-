import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';
import { AppointmentNotFoundError } from '../../domain/errors/domain.error';

export class GetAppointmentByIdUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new AppointmentNotFoundError(id);
    return appointment;
  }
}

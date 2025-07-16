import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';

export class GetAppointmentsUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(): Promise<Appointment[]> {
    return await this.appointmentRepository.findAll();
  }
}

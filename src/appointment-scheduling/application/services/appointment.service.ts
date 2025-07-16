import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';
import { UserRepository } from '../../../user-management/domain/interfaces/user.repository';
import { SpecialtyRepository } from '../../../specialties/domain/interfaces/specialty.repository';
import { ServiceRepository } from '../../../services/domain/interfaces/service.repository';
import { CreateAppointmentUseCase } from '../use-cases/create-appointment.use-case';
import { UpdateAppointmentUseCase } from '../use-cases/update-appointment.use-case';
import { GetAppointmentsUseCase } from '../use-cases/get-appointments.use-case';
import { GetAppointmentByIdUseCase } from '../use-cases/get-appointment-by-id.use-case';
import { CancelAppointmentUseCase } from '../use-cases/cancel-appointment.use-case';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';
import { Appointment } from '../../domain/entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private userRepository: UserRepository,
    private specialtyRepository: SpecialtyRepository,
    private serviceRepository: ServiceRepository,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const useCase = new CreateAppointmentUseCase(
      this.appointmentRepository,
      this.userRepository,
      this.specialtyRepository,
      this.serviceRepository,
    );
    return await useCase.execute(dto);
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const useCase = new UpdateAppointmentUseCase(
      this.appointmentRepository,
      this.userRepository,
      this.specialtyRepository,
      this.serviceRepository,
    );
    return await useCase.execute(id, dto);
  }

  async getAll(): Promise<Appointment[]> {
    const useCase = new GetAppointmentsUseCase(this.appointmentRepository);
    return await useCase.execute();
  }

  async getById(id: string): Promise<Appointment> {
    const useCase = new GetAppointmentByIdUseCase(this.appointmentRepository);
    return await useCase.execute(id);
  }

  async cancel(id: string): Promise<Appointment> {
    const useCase = new CancelAppointmentUseCase(this.appointmentRepository);
    return await useCase.execute(id);
  }
}

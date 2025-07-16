import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';
import { RedisAppointmentCache } from '../../domain/interfaces/redis-appointment-cache.interface';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { AppointmentTime } from '../../domain/value-objects/appointment-time.vo';
import { AppointmentStatus } from '@prisma/client';
import {
  AppointmentConflictError,
  InvalidUserRoleError,
} from '../../domain/errors/domain.error';
import { UserRepository } from '../../../user-management/domain/interfaces/user.repository';
import { SpecialtyRepository } from '../../../specialties/domain/interfaces/specialty.repository';
import { ServiceRepository } from '../../../services/domain/interfaces/service.repository';
import { RedisNotificationQueueService } from '../../infrastructure/external/redis-notification-queue.service';
import { v4 as uuidv4 } from 'uuid';

export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private userRepository: UserRepository,
    private specialtyRepository: SpecialtyRepository,
    private serviceRepository: ServiceRepository,
    private redisCache: RedisAppointmentCache,
    private notificationQueue: RedisNotificationQueueService,
  ) {}

  async execute(dto: CreateAppointmentDto): Promise<Appointment> {
    // Validate patient and doctor roles
    const patient = await this.userRepository.findById(dto.patientId);
    if (!patient || patient.role !== 'PATIENT')
      throw new InvalidUserRoleError(dto.patientId, 'PATIENT');
    const doctor = await this.userRepository.findById(dto.doctorId);
    if (!doctor || doctor.role !== 'DOCTOR')
      throw new InvalidUserRoleError(dto.doctorId, 'DOCTOR');

    // Validate specialty and service
    const specialty = await this.specialtyRepository.findById(dto.specialtyId);
    if (!specialty) throw new Error(`Specialty ${dto.specialtyId} not found`);
    const service = await this.serviceRepository.findById(dto.serviceId);
    if (!service) throw new Error(`Service ${dto.serviceId} not found`);

    // Validate appointment time
    const time = new AppointmentTime(dto.startTime, dto.endTime);

    // Check doctor availability (first check cache)
    let isAvailable = await this.redisCache.getDoctorAvailability(
      dto.doctorId,
      dto.startTime,
      dto.endTime,
    );
    if (isAvailable === null) {
      const conflicts = await this.appointmentRepository.findByDoctorAndTime(
        dto.doctorId,
        dto.startTime,
        dto.endTime,
      );
      isAvailable = conflicts.length === 0;
      await this.redisCache.cacheDoctorAvailability(
        dto.doctorId,
        dto.startTime,
        dto.endTime,
        isAvailable,
      );
    }
    if (!isAvailable)
      throw new AppointmentConflictError(dto.doctorId, dto.startTime);

    // Verify doctor's specialty
    const doctorSpecialties = await this.specialtyRepository.findByDoctorId(
      dto.doctorId,
    );
    if (!doctorSpecialties.some((s) => s.id === dto.specialtyId)) {
      throw new Error(
        `Doctor ${dto.doctorId} does not have specialty ${dto.specialtyId}`,
      );
    }

    const appointment = new Appointment(
      uuidv4(),
      dto.patientId,
      dto.doctorId,
      dto.serviceId,
      dto.specialtyId,
      dto.startTime,
      dto.endTime,
      dto.status || AppointmentStatus.SCHEDULED,
    );

    await this.appointmentRepository.save(appointment);

    // Queue notification
    await this.notificationQueue.queueNotification(
      appointment,
      `Appointment scheduled with Dr. ${doctor.profile || 'Doctor'} on ${dto.startTime.toISOString()}`,
    );

    return appointment;
  }
}

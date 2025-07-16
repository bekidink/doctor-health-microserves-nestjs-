import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentRepository } from '../../domain/interfaces/appointment.repository';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';
import {
  AppointmentNotFoundError,
  AppointmentConflictError,
  InvalidUserRoleError,
} from '../../domain/errors/domain.error';
import { AppointmentTime } from '../../domain/value-objects/appointment-time.vo';
import { AppointmentStatusVo } from '../../domain/value-objects/appointment-status.vo';
import { UserRepository } from '../../../user-management/domain/interfaces/user.repository';
import { SpecialtyRepository } from '../../../specialties/domain/interfaces/specialty.repository';
import { ServiceRepository } from '../../../services/domain/interfaces/service.repository';

export class UpdateAppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private userRepository: UserRepository,
    private specialtyRepository: SpecialtyRepository,
    private serviceRepository: ServiceRepository,
  ) {}

  async execute(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) throw new AppointmentNotFoundError(id);

    let updatedPatientId = appointment.patientId;
    if (dto.patientId && dto.patientId !== appointment.patientId) {
      const patient = await this.userRepository.findById(dto.patientId);
      if (!patient || patient.role !== 'PATIENT')
        throw new InvalidUserRoleError(dto.patientId, 'PATIENT');
      updatedPatientId = dto.patientId;
    }

    let updatedDoctorId = appointment.doctorId;
    let updatedSpecialtyId = appointment.specialtyId;
    if (dto.doctorId && dto.doctorId !== appointment.doctorId) {
      const doctor = await this.userRepository.findById(dto.doctorId);
      if (!doctor || doctor.role !== 'DOCTOR')
        throw new InvalidUserRoleError(dto.doctorId, 'DOCTOR');
      updatedDoctorId = dto.doctorId;

      // Verify doctor's specialty if specialtyId is also updated
      if (dto.specialtyId) {
        const specialty = await this.specialtyRepository.findById(
          dto.specialtyId,
        );
        if (!specialty)
          throw new Error(`Specialty ${dto.specialtyId} not found`);
        const doctorSpecialties = await this.specialtyRepository.findByDoctorId(
          dto.doctorId,
        );
        if (!doctorSpecialties.some((s) => s.id === dto.specialtyId)) {
          throw new Error(
            `Doctor ${dto.doctorId} does not have specialty ${dto.specialtyId}`,
          );
        }
        updatedSpecialtyId = dto.specialtyId;
      }
    }

    let updatedServiceId = appointment.serviceId;
    if (dto.serviceId) {
      const service = await this.serviceRepository.findById(dto.serviceId);
      if (!service) throw new Error(`Service ${dto.serviceId} not found`);
      updatedServiceId = dto.serviceId;
    }

    let updatedStartTime = appointment.startTime;
    let updatedEndTime = appointment.endTime;
    if (dto.startTime || dto.endTime) {
      const startTime = dto.startTime || appointment.startTime;
      const endTime = dto.endTime || appointment.endTime;
      new AppointmentTime(startTime, endTime);
      const conflicts = await this.appointmentRepository.findByDoctorAndTime(
        updatedDoctorId,
        startTime,
        endTime,
      );
      if (conflicts.some((c) => c.id !== id))
        throw new AppointmentConflictError(updatedDoctorId, startTime);
      updatedStartTime = startTime;
      updatedEndTime = endTime;
    }

    const updatedStatus = dto.status
      ? new AppointmentStatusVo(dto.status).value
      : appointment.status;

    const updatedAppointment = new Appointment(
      appointment.id,
      updatedPatientId,
      updatedDoctorId,
      updatedServiceId,
      updatedSpecialtyId,
      updatedStartTime,
      updatedEndTime,
      updatedStatus,
      appointment.createdAt,
      new Date(),
    );

    await this.appointmentRepository.update(updatedAppointment);
    return updatedAppointment;
  }
}

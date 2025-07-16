import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from '../../application/services/appointment.service';
import { CreateAppointmentDto } from '../../application/dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../../application/dtos/update-appointment.dto';
import { AuthGuard } from '../middlewares/auth.middleware';
import { AuditLogService } from '../../infrastructure/external/audit-log.service';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private appointmentService: AppointmentService,
    private auditLogService: AuditLogService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAppointmentDto) {
    const appointment = await this.appointmentService.create(dto);
    await this.auditLogService.logAction('create_appointment', {
      appointmentId: appointment.id,
      patientId: dto.patientId,
      doctorId: dto.doctorId,
      startTime: dto.startTime,
    });
    return appointment;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    const appointment = await this.appointmentService.update(id, dto);
    await this.auditLogService.logAction('update_appointment', {
      appointmentId: id,
      updatedFields: Object.keys(dto),
    });
    return appointment;
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.appointmentService.getAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    const appointment = await this.appointmentService.getById(id);
    await this.auditLogService.logAction('get_appointment', {
      appointmentId: id,
    });
    return appointment;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string) {
    const appointment = await this.appointmentService.cancel(id);
    await this.auditLogService.logAction('cancel_appointment', {
      appointmentId: id,
    });
    return appointment;
  }
}

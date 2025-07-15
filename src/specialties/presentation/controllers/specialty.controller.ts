import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SpecialtyService } from '../../application/services/specialty.service';
import { CreateSpecialtyDto } from '../../application/dtos/create-specialty.dto';
import { UpdateSpecialtyDto } from '../../application/dtos/update-specialty.dto';
import { AssignSpecialtyDto } from '../../application/dtos/assign-specialty.dto';
import { AuthGuard } from '../middlewares/auth.middleware';
import { AuditLogService } from '../../infrastructure/external/audit-log.service';

@Controller('specialties')
export class SpecialtyController {
  constructor(
    private specialtyService: SpecialtyService,
    private auditLogService: AuditLogService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateSpecialtyDto) {
    const specialty = await this.specialtyService.create(dto);
    await this.auditLogService.logAction('create_specialty', {
      specialtyId: specialty.id,
      imageUrl: dto.imageUrl,
    });
    return specialty;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateSpecialtyDto) {
    const specialty = await this.specialtyService.update(id, dto);
    await this.auditLogService.logAction('update_specialty', {
      specialtyId: id,
      imageUrl: dto.imageUrl,
    });
    return specialty;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.specialtyService.getAll();
  }

  @Post('assign')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async assignToDoctor(@Body() dto: AssignSpecialtyDto) {
    await this.specialtyService.assignToDoctor(dto);
    await this.auditLogService.logAction('assign_specialty', {
      specialtyId: dto.specialtyId,
      doctorId: dto.doctorId,
    });
  }
}

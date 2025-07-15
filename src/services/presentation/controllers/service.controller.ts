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
import { ServiceService } from '../../application/services/service.service';
import { CreateServiceDto } from '../../application/dtos/create-service.dto';
import { UpdateServiceDto } from '../../application/dtos/update-service.dto';
import { AuthGuard } from '../middlewares/auth.middleware';
import { AuditLogService } from '../../infrastructure/external/audit-log.service';

@Controller('services')
export class ServiceController {
  constructor(
    private serviceService: ServiceService,
    private auditLogService: AuditLogService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceDto) {
    const service = await this.serviceService.create(dto);
    await this.auditLogService.logAction('create_service', {
      serviceId: service.id,
      code: dto.code,
      imageUrl: dto.imageUrl,
    });
    return service;
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    const service = await this.serviceService.update(id, dto);
    await this.auditLogService.logAction('update_service', {
      serviceId: id,
      imageUrl: dto.imageUrl,
    });
    return service;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.serviceService.getAll();
  }
}

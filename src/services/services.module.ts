import { Module } from '@nestjs/common';
import { ServiceController } from './presentation/controllers/service.controller';
import { ServiceService } from './application/services/service.service';
import { PrismaServiceRepository } from './infrastructure/persistence/prisma-service.repository';
import { PrismaService } from '../shared/persistence/prisma.service';
import { AuditLogService } from './infrastructure/external/audit-log.service';

@Module({
  controllers: [ServiceController],
  providers: [
    ServiceService,
    AuditLogService,
    PrismaService,
    { provide: 'ServiceRepository', useClass: PrismaServiceRepository },
  ],
})
export class ServicesModule {}

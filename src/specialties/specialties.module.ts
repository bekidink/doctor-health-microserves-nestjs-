import { Module } from '@nestjs/common';
import { SpecialtyController } from './presentation/controllers/specialty.controller';
import { SpecialtyService } from './application/services/specialty.service';
import { PrismaSpecialtyRepository } from './infrastructure/persistence/prisma-specialty.repository';
import { PrismaService } from '../shared/persistence/prisma.service';
import { AuditLogService } from './infrastructure/external/audit-log.service';
import { PrismaUserRepository } from '../user-management/infrastructure/presistence/prisma-user.repository';

@Module({
  controllers: [SpecialtyController],
  providers: [
    SpecialtyService,
    AuditLogService,
    PrismaService,
    { provide: 'SpecialtyRepository', useClass: PrismaSpecialtyRepository },
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
})
export class SpecialtiesModule {}

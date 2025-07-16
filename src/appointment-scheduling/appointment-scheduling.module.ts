import { Module } from '@nestjs/common';
import { AppointmentController } from './presentation/controllers/appointment.controller';
import { AppointmentService } from './application/services/appointment.service';
import { PrismaAppointmentRepository } from './infrastructure/persistence/prisma-appointment.repository';
import { RedisAppointmentCacheService } from './infrastructure/persistence/redis-appointment-cache.service';
import { AuditLogService } from './infrastructure/external/audit-log.service';
import { RedisNotificationQueueService } from './infrastructure/external/redis-notification-queue.service';
import { NotificationWorker } from './infrastructure/external/notification-worker';
import { PrismaService } from '../shared/persistence/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { UserManagementModule } from '../user-management/user-management.module';
import { SpecialtiesModule } from '../specialties/specialties.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [UserManagementModule, SpecialtiesModule, ServicesModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    AuditLogService,
    PrismaService,
    RedisService,
    RedisNotificationQueueService,
    NotificationWorker,
    { provide: 'AppointmentRepository', useClass: PrismaAppointmentRepository },
    {
      provide: 'RedisAppointmentCache',
      useClass: RedisAppointmentCacheService,
    },
  ],
  exports: [
    { provide: 'AppointmentRepository', useClass: PrismaAppointmentRepository },
    {
      provide: 'RedisAppointmentCache',
      useClass: RedisAppointmentCacheService,
    },
  ],
})
export class AppointmentSchedulingModule {}

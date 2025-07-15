import { Module } from '@nestjs/common';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';
import { PrismaUserRepository } from './infrastructure/presistence/prisma-user.repository';
import { PrismaService } from '../shared/persistence/prisma.service';
import { AuditLogService } from './infrastructure/external/audit-log.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuditLogService,
    PrismaService,
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
  exports: [{ provide: 'UserRepository', useClass: PrismaUserRepository }],
})
export class UserManagementModule {}

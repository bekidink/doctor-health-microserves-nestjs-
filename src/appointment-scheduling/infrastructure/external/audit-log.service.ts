import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/persistence/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    action: string,
    details: Record<string, any>,
    userId?: string,
    appointmentId?: string,
  ): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        action,
        details,
        userId,
        appointmentId,
        createdAt: new Date(),
      },
    });
  }
}

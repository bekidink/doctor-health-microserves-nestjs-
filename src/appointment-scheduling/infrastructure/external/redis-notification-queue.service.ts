import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import { Appointment } from '../../domain/entities/appointment.entity';

@Injectable()
export class RedisNotificationQueueService {
  constructor(private redisService: RedisService) {}

  async queueNotification(
    appointment: Appointment,
    message: string,
  ): Promise<void> {
    const client = this.redisService.getClient();
    const queueKey = 'notifications:appointments';
    const notification = JSON.stringify({
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      message,
      timestamp: new Date().toISOString(),
    });
    await client.rPush(queueKey, notification);
  }

  async processNotifications(
    handler: (notification: any) => Promise<void>,
  ): Promise<void> {
    const client = this.redisService.getClient();
    const queueKey = 'notifications:appointments';
    while (true) {
      const result = await client.blPop(queueKey, 10); // Block for 10 seconds
      if (result) {
        const notification = JSON.parse(result.element);
        await handler(notification);
      }
    }
  }
}

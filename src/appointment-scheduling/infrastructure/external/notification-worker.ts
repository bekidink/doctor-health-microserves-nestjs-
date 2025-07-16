import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisNotificationQueueService } from './redis-notification-queue.service';

@Injectable()
export class NotificationWorker implements OnModuleInit {
  constructor(private notificationQueue: RedisNotificationQueueService) {}

  async onModuleInit() {
    await this.notificationQueue.processNotifications(async (notification) => {
      console.log(`Sending notification: ${notification.message}`);
      // Integrate with SMS/email service (e.g., Twilio, SendGrid)
      // Example: await twilioClient.messages.create({ from: 'your_number', to: notification.patientId, body: notification.message });
    });
  }
}

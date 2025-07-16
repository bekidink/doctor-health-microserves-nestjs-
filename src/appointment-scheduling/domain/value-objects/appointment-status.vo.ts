import { AppointmentStatus } from '@prisma/client';
export class AppointmentStatusVo {
  constructor(public readonly value: AppointmentStatus) {
    if (!Object.values(AppointmentStatus).includes(value)) {
      throw new Error(`Invalid appointment status: ${value}`);
    }
  }
}

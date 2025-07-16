export class AppointmentTime {
  constructor(
    public readonly startTime: Date,
    public readonly endTime: Date,
  ) {
    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }
    if (startTime < new Date()) {
      throw new Error('Cannot schedule appointments in the past');
    }
  }
}

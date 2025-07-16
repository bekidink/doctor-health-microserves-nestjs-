export interface RedisAppointmentCache {
  cacheDoctorAvailability(
    doctorId: string,
    startTime: Date,
    endTime: Date,
    isAvailable: boolean,
  ): Promise<void>;
  getDoctorAvailability(
    doctorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean | null>;
}

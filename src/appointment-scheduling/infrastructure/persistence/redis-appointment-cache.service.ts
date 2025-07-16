import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../shared/redis/redis.service';
import { RedisAppointmentCache } from '../../domain/interfaces/redis-appointment-cache.interface';

@Injectable()
export class RedisAppointmentCacheService implements RedisAppointmentCache {
  constructor(private redisService: RedisService) {}

  async cacheDoctorAvailability(
    doctorId: string,
    startTime: Date,
    endTime: Date,
    isAvailable: boolean,
  ): Promise<void> {
    const client = this.redisService.getClient();
    const key = `availability:${doctorId}`;
    const score = startTime.getTime();
    const value = JSON.stringify({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isAvailable,
    });
    await client.zAdd(key, [{ score, value }]);
    // Set TTL for cache (e.g., 24 hours)
    await client.expire(key, 24 * 60 * 60);
  }

  async getDoctorAvailability(
    doctorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean | null> {
    const client = this.redisService.getClient();
    const key = `availability:${doctorId}`;
    const results = await client.zRangeByScore(
      key,
      startTime.getTime(),
      endTime.getTime(),
    );
    if (results.length === 0) return null;
    const slot = JSON.parse(results[0]);
    return slot.isAvailable;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { CacheConnectionException } from './exceptions/mask.exceptions';

@Injectable()
export class CacheService {
  private client: RedisClientType;
  private readonly logger = new Logger(CacheService.name);

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.client.connect().catch(err => {
      this.logger.error('Redis connection failed', err);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error('Cache get error', error);
      throw new CacheConnectionException();
    }
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    try {
      await this.client.setEx(key, ttl, value);
    } catch (error) {
      this.logger.error('Cache set error', error);
      throw new CacheConnectionException();
    }
  }
}

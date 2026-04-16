import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ICache } from '../ports/i-cache';

@Injectable()
export class RedisCacheUtil extends ICache implements OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheUtil.name);
  private readonly client: Redis;

  constructor() {
    super();
    this.client = new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
      password: process.env.REDIS_PASSWORD ?? undefined,
    });

    this.client.on('error', (err) =>
      this.logger.error('Redis error', err.stack),
    );
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}

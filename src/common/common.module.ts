import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { TypeOrmTransactionManager } from './infra/typeorm-transaction-manager';
import { ICache } from './ports/i-cache';
import { ITransactionManager } from './ports/i-transaction-manager';
import { JwtUtil } from './utils/jwt.util';
import { Pbkdf2Util } from './utils/pbkdf2.util';
import { RedisCacheUtil } from './utils/redis-cache.util';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as StringValue,
        },
      }),
    }),
  ],
  providers: [
    Pbkdf2Util,
    JwtUtil,
    { provide: ITransactionManager, useClass: TypeOrmTransactionManager },
    { provide: ICache, useClass: RedisCacheUtil },
  ],
  exports: [Pbkdf2Util, JwtUtil, ITransactionManager, ICache],
})
export class CommonModule {}

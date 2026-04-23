import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { GptModelOrmEntity } from '../modules/agent/infra/orm-entities/gpt-model.orm-entity';
import { RefreshTokenOrmEntity } from '../modules/auth/infra/orm-entities/refresh-token.orm-entity';
import { BotOrmEntity } from '../modules/bot/infra/orm-entities/bot.orm-entity';
import { ChatOrmEntity } from '../modules/chat/infra/orm-entities/chat.orm-entity';
import { MessageOrmEntity } from '../modules/chat/infra/orm-entities/message.orm-entity';
import { UserPasswordOrmEntity } from '../modules/user/infra/orm-entities/user-password.orm-entity';
import { UserOrmEntity } from '../modules/user/infra/orm-entities/user.orm-entity';

config();

const entities = [
  UserOrmEntity,
  UserPasswordOrmEntity,
  RefreshTokenOrmEntity,
  GptModelOrmEntity,
  BotOrmEntity,
  ChatOrmEntity,
  MessageOrmEntity,
];

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities,
  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

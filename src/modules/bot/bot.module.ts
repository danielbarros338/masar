import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotController } from './api/controllers/bot.controller';
import { IBotRepository } from './application/ports/i-bot.repository';
import { CreateBotUseCase } from './application/use-cases/create-bot.use-case';
import { BotOrmEntity } from './infra/orm-entities/bot.orm-entity';
import { BotRepository } from './infra/repositories/bot.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BotOrmEntity])],
  controllers: [BotController],
  providers: [
    CreateBotUseCase,
    { provide: IBotRepository, useClass: BotRepository },
  ],
  exports: [IBotRepository],
})
export class BotModule {}

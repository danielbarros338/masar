import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotController } from './api/controllers/bot.controller';
import { IBotRepository } from './application/ports/i-bot.repository';
import { CreateBotUseCase } from './application/use-cases/create-bot.use-case';
import { DeleteBotUseCase } from './application/use-cases/delete-bot.use-case';
import { ListUserBotsUseCase } from './application/use-cases/list-user-bots.use-case';
import { UpdateBotUseCase } from './application/use-cases/update-bot.use-case';
import { BotOrmEntity } from './infra/orm-entities/bot.orm-entity';
import { BotRepository } from './infra/repositories/bot.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BotOrmEntity])],
  controllers: [BotController],
  providers: [
    CreateBotUseCase,
    ListUserBotsUseCase,
    UpdateBotUseCase,
    DeleteBotUseCase,
    { provide: IBotRepository, useClass: BotRepository },
  ],
  exports: [IBotRepository],
})
export class BotModule {}


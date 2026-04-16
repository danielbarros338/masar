import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../../common/types/jwt.types';
import { BotResponseDto } from '../../application/dto/bot-response.dto';
import { CreateBotDto } from '../../application/dto/create-bot.dto';
import { CreateBotUseCase } from '../../application/use-cases/create-bot.use-case';
import { ApiCreateBot } from './bot.swagger';

@ApiTags('bots')
@ApiBearerAuth()
@Controller('bots')
export class BotController {
  constructor(private readonly createBot: CreateBotUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateBot()
  create(
    @Body() dto: CreateBotDto,
    @CurrentUser() user: JwtUser,
  ): Promise<BotResponseDto> {
    return this.createBot.execute(dto, user.sub);
  }
}

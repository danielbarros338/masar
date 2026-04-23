import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../../../common/types/jwt.types';
import { BotResponseDto } from '../../application/dto/bot-response.dto';
import { CreateBotDto } from '../../application/dto/create-bot.dto';
import { UpdateBotDto } from '../../application/dto/update-bot.dto';
import { CreateBotUseCase } from '../../application/use-cases/create-bot.use-case';
import { DeleteBotUseCase } from '../../application/use-cases/delete-bot.use-case';
import { ListUserBotsUseCase } from '../../application/use-cases/list-user-bots.use-case';
import { UpdateBotUseCase } from '../../application/use-cases/update-bot.use-case';
import { ApiCreateBot, ApiDeleteBot, ApiListUserBots, ApiUpdateBot } from './bot.swagger';

@ApiTags('bots')
@ApiBearerAuth()
@Controller('bots')
export class BotController {
  constructor(
    private readonly createBot: CreateBotUseCase,
    private readonly listUserBots: ListUserBotsUseCase,
    private readonly updateBot: UpdateBotUseCase,
    private readonly deleteBot: DeleteBotUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateBot()
  create(
    @Body() dto: CreateBotDto,
    @CurrentUser() user: JwtUser,
  ): Promise<BotResponseDto> {
    return this.createBot.execute(dto, user.sub);
  }

  @Get()
  @ApiListUserBots()
  list(@CurrentUser() user: JwtUser): Promise<BotResponseDto[]> {
    return this.listUserBots.execute(user.sub);
  }

  @Patch(':id')
  @ApiUpdateBot()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBotDto,
    @CurrentUser() user: JwtUser,
  ): Promise<BotResponseDto> {
    return this.updateBot.execute(id, dto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteBot()
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser): Promise<void> {
    return this.deleteBot.execute(id, user.sub);
  }
}


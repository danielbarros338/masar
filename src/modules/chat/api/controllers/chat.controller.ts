import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatResponseDto } from '../../application/dto/chat-response.dto';
import { CreateChatDto } from '../../application/dto/create-chat.dto';
import { IncomingMessageDto } from '../../application/dto/incoming-message.dto';
import { MessageResponseDto } from '../../application/dto/message-response.dto';
import { CreateChatUseCase } from '../../application/use-cases/create-chat.use-case';
import { ProcessIncomingMessageUseCase } from '../../application/use-cases/process-incoming-message.use-case';
import { ApiCreateChat, ApiReceiveMessage } from './chat.swagger';

@ApiTags('chats')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Não autenticado' })
@Controller('chats')
export class ChatController {
  constructor(
    private readonly createChat: CreateChatUseCase,
    private readonly processIncomingMessage: ProcessIncomingMessageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreateChat()
  create(@Body() dto: CreateChatDto): Promise<ChatResponseDto> {
    return this.createChat.execute(dto);
  }

  @Post('incoming-message')
  @HttpCode(HttpStatus.OK)
  @ApiReceiveMessage()
  receiveMessage(@Body() dto: IncomingMessageDto): Promise<MessageResponseDto> {
    return this.processIncomingMessage.execute({
      botId: dto.botId,
      phoneNumber: dto.phoneNumber,
      message: dto.message,
      userType: dto.userType,
    });
  }
}

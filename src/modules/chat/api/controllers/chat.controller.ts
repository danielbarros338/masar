import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatResponseDto } from '../../application/dto/chat-response.dto';
import { CreateChatDto } from '../../application/dto/create-chat.dto';
import { IncomingMessageDto } from '../../application/dto/incoming-message.dto';
import { IMessagePublisher } from '../../application/ports/i-message-publisher';
import { CreateChatUseCase } from '../../application/use-cases/create-chat.use-case';

@Controller('chats')
export class ChatController {
  constructor(
    private readonly createChat: CreateChatUseCase,
    private readonly messagePublisher: IMessagePublisher,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateChatDto): Promise<ChatResponseDto> {
    return this.createChat.execute(dto);
  }

  @Post('incoming-message')
  @HttpCode(HttpStatus.ACCEPTED)
  async receiveMessage(@Body() dto: IncomingMessageDto): Promise<void> {
    await this.messagePublisher.publishIncomingMessage({
      botId: dto.botId,
      phoneNumber: dto.phoneNumber,
      message: dto.message,
      userType: dto.userType,
    });
  }
}

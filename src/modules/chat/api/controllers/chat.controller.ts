import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatResponseDto } from '../../application/dto/chat-response.dto';
import { CreateChatDto } from '../../application/dto/create-chat.dto';
import { CreateChatUseCase } from '../../application/use-cases/create-chat.use-case';

@Controller('chats')
export class ChatController {
  constructor(private readonly createChat: CreateChatUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateChatDto): Promise<ChatResponseDto> {
    return this.createChat.execute(dto);
  }
}

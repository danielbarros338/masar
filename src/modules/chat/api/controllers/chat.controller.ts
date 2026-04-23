import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../../common/decorators/public.decorator';
import { ChatResponseDto } from '../../application/dto/chat-response.dto';
import { CreateChatDto } from '../../application/dto/create-chat.dto';
import { IncomingMessageDto } from '../../application/dto/incoming-message.dto';
import { IncomingWhatsappMessageDto } from '../../application/dto/incoming-whatsapp-message.dto';
import { MessageResponseDto } from '../../application/dto/message-response.dto';
import { CreateChatUseCase } from '../../application/use-cases/create-chat.use-case';
import { ProcessIncomingMessageUseCase } from '../../application/use-cases/process-incoming-message.use-case';
import { ProcessIncomingWhatsappMessageUseCase } from '../../application/use-cases/process-incoming-whatsapp-message.use-case';
import { ApiCreateChat, ApiReceiveMessage, ApiReceiveWhatsappMessage } from './chat.swagger';

@ApiTags('chats')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Não autenticado' })
@Controller('chats')
export class ChatController {
  constructor(
    private readonly createChat: CreateChatUseCase,
    private readonly processIncomingMessage: ProcessIncomingMessageUseCase,
    private readonly processIncomingWhatsappMessage: ProcessIncomingWhatsappMessageUseCase,
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

  @Post('incoming-whatsapp-message')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiReceiveWhatsappMessage()
  receiveWhatsappMessage(@Body() dto: IncomingWhatsappMessageDto): Promise<void> {
    return this.processIncomingWhatsappMessage.execute(dto);
  }
}

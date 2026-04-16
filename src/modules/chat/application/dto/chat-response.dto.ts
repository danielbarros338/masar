import { ChatStatus } from '../../domain/message.types';

export class ChatResponseDto {
  id: string;
  botId: string;
  phoneNumber: string | null | undefined;
  chatStatus: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
}

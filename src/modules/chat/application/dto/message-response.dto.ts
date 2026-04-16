import { UserType } from '../../domain/message.types';

export class MessageResponseDto {
  id: string;
  chatId: string;
  message: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

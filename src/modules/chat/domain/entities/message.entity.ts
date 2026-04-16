import { UserType } from '../message.types';
import { MessageProps } from '../props/message.props';

export class MessageEntity {
  constructor(private readonly props: MessageProps) {}

  get id(): string {
    return this.props.id;
  }

  get chatId(): string {
    return this.props.chatId;
  }

  get message(): string {
    return this.props.message;
  }

  get userType(): UserType {
    return this.props.userType;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }
}

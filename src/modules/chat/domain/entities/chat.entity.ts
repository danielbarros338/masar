import { ChatStatus } from '../message.types';
import { ChatProps } from '../props/chat.props';

export class ChatEntity {
  constructor(private readonly props: ChatProps) {}

  get id(): string {
    return this.props.id;
  }

  get botId(): string {
    return this.props.botId;
  }

  get phoneNumber(): string | null | undefined {
    return this.props.phoneNumber;
  }

  get chatStatus(): ChatStatus {
    return this.props.chatStatus;
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

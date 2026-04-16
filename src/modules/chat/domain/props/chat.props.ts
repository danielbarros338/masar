import { ChatStatus } from '../message.types';

export type ChatProps = {
  id: string;
  botId: string;
  phoneNumber?: string | null;
  chatStatus: ChatStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

import { UserType } from '../message.types';

export type MessageProps = {
  id: string;
  chatId: string;
  message: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

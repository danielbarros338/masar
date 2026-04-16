export enum UserType {
  BOT = 'BOT',
  USER = 'USER',
  OPERATOR = 'OPERATOR',
}

export enum ChatStatus {
  BOT = 'BOT',
  AWAIT = 'AWAIT',
  OPERATOR = 'OPERATOR',
  FINISHED = 'FINISHED',
}

export type IncomingMessagePayload = {
  botId: string;
  phoneNumber: string;
  message: string;
  userType: UserType;
};

export const CHAT_QUEUES = {
  INCOMING_MESSAGES: 'chat.incoming-messages',
} as const;

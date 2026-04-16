export type ChatProps = {
  id: string;
  botId: string;
  phoneNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

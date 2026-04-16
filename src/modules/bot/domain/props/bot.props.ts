export type BotProps = {
  id: string;
  name: string;
  type: string;
  modelId: string;
  language: string;
  phoneNumber: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

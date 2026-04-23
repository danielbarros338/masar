export type BotProps = {
  id: string;
  name: string;
  type: string;
  modelId: string;
  language: string;
  persona: string;
  phoneNumber: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

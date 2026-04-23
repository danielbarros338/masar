export type KnowledgeProps = {
  id: string;
  botId: string;
  code: string;
  behaviour: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

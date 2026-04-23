import { KnowledgeProps } from '../props/knowledge.props';

export class KnowledgeEntity {
  constructor(private readonly props: KnowledgeProps) {}

  get id(): string {
    return this.props.id;
  }

  get botId(): string {
    return this.props.botId;
  }

  get code(): string {
    return this.props.code;
  }

  get behaviour(): string {
    return this.props.behaviour;
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

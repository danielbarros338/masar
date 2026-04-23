import { BotProps } from '../props/bot.props';

export class BotEntity {
  constructor(private props: BotProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): string {
    return this.props.type;
  }

  get modelId(): string {
    return this.props.modelId;
  }

  get language(): string {
    return this.props.language;
  }

  get persona(): string {
    return this.props.persona;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get userId(): string {
    return this.props.userId;
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

  update(data: Partial<Omit<BotProps, 'id' | 'userId' | 'createdAt'>>): void {
    this.props = { ...this.props, ...data, updatedAt: new Date() };
  }
}

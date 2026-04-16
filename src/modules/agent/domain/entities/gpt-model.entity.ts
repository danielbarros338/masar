import { GptModelProps } from '../props/gpt-model.props';

export class GptModelEntity {
  constructor(private readonly props: GptModelProps) {}

  get id(): string {
    return this.props.id;
  }
  get provider(): string {
    return this.props.provider;
  }
  get modelId(): string {
    return this.props.modelId;
  }
  get displayName(): string {
    return this.props.displayName;
  }
  get isActive(): boolean {
    return this.props.isActive;
  }
  get isDefault(): boolean {
    return this.props.isDefault;
  }
  get isDeprecated(): boolean {
    return this.props.isDeprecated;
  }
  get supportsChats(): boolean {
    return this.props.supportsChats;
  }
  get supportsStreaming(): boolean {
    return this.props.supportsStreaming;
  }
  get supportsReasoning(): boolean {
    return this.props.supportsReasoning;
  }
  get supportsTools(): boolean {
    return this.props.supportsTools;
  }
  get contextWindow(): number {
    return this.props.contextWindow;
  }
  get maxOutputTokens(): number {
    return this.props.maxOutputTokens;
  }
  get inputCost(): number {
    return this.props.inputCost;
  }
  get outputCost(): number {
    return this.props.outputCost;
  }
  get speedScore(): number {
    return this.props.speedScore;
  }
  get qualityScore(): number {
    return this.props.qualityScore;
  }
  get priority(): number {
    return this.props.priority;
  }
  get metadata(): Record<string, unknown> | null {
    return this.props.metadata;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }
}

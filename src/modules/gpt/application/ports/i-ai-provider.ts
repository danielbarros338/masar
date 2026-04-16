export abstract class IAiProvider {
  abstract readonly providerName: string;
  abstract complete(prompt: string, modelId: string): Promise<string>;
  abstract listModels(): Promise<string[]>;
}

export abstract class IWhatsappProvider {
  abstract sendTextMessage(from: string, to: string, text: string): Promise<void>;
}

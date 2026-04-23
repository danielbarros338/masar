import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IWhatsappProvider } from '../../application/ports/i-whatsapp-provider';

@Injectable()
export class InfobipWhatsappProvider extends IWhatsappProvider {
  private readonly logger = new Logger(InfobipWhatsappProvider.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.baseUrl = this.configService.getOrThrow<string>('INFOBIP_BASE_URL');
    this.apiKey = this.configService.getOrThrow<string>('INFOBIP_API_KEY');
  }

  async sendTextMessage(from: string, to: string, text: string): Promise<void> {
    const url = `${this.baseUrl}/whatsapp/1/message/text`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `App ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, content: { text } }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(
        `Falha ao enviar mensagem WhatsApp via Infobip: status=${response.status} body=${errorBody}`,
      );
      throw new Error(`Infobip WhatsApp send failed: ${response.status}`);
    }

    this.logger.log(`Mensagem WhatsApp enviada: from=${from} to=${to}`);
  }
}

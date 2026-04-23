import { Injectable, Logger } from '@nestjs/common';
import { IBotRepository } from '../../../bot/application/ports/i-bot.repository';
import { UserType } from '../../domain/message.types';
import { IncomingWhatsappMessageDto } from '../dto/incoming-whatsapp-message.dto';
import { IWhatsappProvider } from '../ports/i-whatsapp-provider';
import { ProcessIncomingMessageUseCase } from './process-incoming-message.use-case';

@Injectable()
export class ProcessIncomingWhatsappMessageUseCase {
  private readonly logger = new Logger(ProcessIncomingWhatsappMessageUseCase.name);

  constructor(
    private readonly botRepository: IBotRepository,
    private readonly processIncomingMessage: ProcessIncomingMessageUseCase,
    private readonly whatsappProvider: IWhatsappProvider,
  ) {}

  async execute(dto: IncomingWhatsappMessageDto): Promise<void> {
    for (const result of dto.results) {
      if (result.message.type !== 'TEXT') {
        this.logger.warn(
          `Tipo de mensagem WhatsApp não suportado: type=${result.message.type} from=${result.from}`,
        );
        continue;
      }

      const bot = await this.botRepository.findByPhoneNumber(result.to);
      if (!bot) {
        this.logger.warn(`Nenhum bot encontrado para o número: to=${result.to}`);
        continue;
      }

      this.logger.log(
        `Mensagem WhatsApp recebida: from=${result.from} to=${result.to} botId=${bot.id}`,
      );

      const response = await this.processIncomingMessage.execute({
        botId: bot.id,
        phoneNumber: result.from,
        message: result.message.text,
        userType: UserType.USER,
      });

      await this.whatsappProvider.sendTextMessage(result.to, result.from, response.message);
    }
  }
}

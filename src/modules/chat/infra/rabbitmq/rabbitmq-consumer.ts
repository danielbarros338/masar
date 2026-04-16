import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ProcessIncomingMessageUseCase } from '../../application/use-cases/process-incoming-message.use-case';
import {
  CHAT_QUEUES,
  IncomingMessagePayload,
} from '../../domain/message.types';
import { RabbitmqService } from './rabbitmq.service';

@Injectable()
export class RabbitmqConsumer implements OnApplicationBootstrap {
  private readonly logger = new Logger(RabbitmqConsumer.name);

  constructor(
    private readonly rabbitmqService: RabbitmqService,
    private readonly processIncomingMessage: ProcessIncomingMessageUseCase,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.rabbitmqService.assertQueue(CHAT_QUEUES.INCOMING_MESSAGES);
    await this.rabbitmqService.consume(
      CHAT_QUEUES.INCOMING_MESSAGES,
      1,
      async (payload) => {
        await this.processIncomingMessage.execute(
          payload as IncomingMessagePayload,
        );
      },
    );
    this.logger.log(
      `Consumidor registrado na fila: ${CHAT_QUEUES.INCOMING_MESSAGES}`,
    );
  }
}

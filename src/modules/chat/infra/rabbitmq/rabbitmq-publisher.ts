import { Injectable } from '@nestjs/common';
import { IMessagePublisher } from '../../application/ports/i-message-publisher';
import {
  CHAT_QUEUES,
  IncomingMessagePayload,
} from '../../domain/message.types';
import { RabbitmqService } from './rabbitmq.service';

@Injectable()
export class RabbitmqPublisher extends IMessagePublisher {
  constructor(private readonly rabbitmqService: RabbitmqService) {
    super();
  }

  async publishIncomingMessage(payload: IncomingMessagePayload): Promise<void> {
    await this.rabbitmqService.assertQueue(CHAT_QUEUES.INCOMING_MESSAGES);
    this.rabbitmqService.publish(CHAT_QUEUES.INCOMING_MESSAGES, payload);
  }
}

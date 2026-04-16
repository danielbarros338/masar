import { IncomingMessagePayload } from '../../domain/message.types';

export abstract class IMessagePublisher {
  abstract publishIncomingMessage(
    payload: IncomingMessagePayload,
  ): Promise<void>;
}

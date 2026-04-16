import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const url = this.configService.getOrThrow<string>('RABBITMQ_URL');
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    this.logger.log('Conexão com RabbitMQ estabelecida');
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.connection.close();
      this.logger.log('Conexão com RabbitMQ encerrada');
    } catch (error) {
      this.logger.error(
        'Erro ao encerrar conexão com RabbitMQ',
        (error as Error).stack,
      );
    }
  }

  async assertQueue(queue: string): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true });
  }

  publish(queue: string, payload: unknown): void {
    const buffer = Buffer.from(JSON.stringify(payload));
    this.channel.sendToQueue(queue, buffer, { persistent: true });
  }

  async consume(
    queue: string,
    prefetch: number,
    handler: (payload: unknown) => Promise<void>,
  ): Promise<void> {
    await this.channel.prefetch(prefetch);
    await this.channel.consume(queue, (msg) => {
      if (!msg) return;
      void (async () => {
        try {
          const payload: unknown = JSON.parse(msg.content.toString());
          await handler(payload);
          this.channel.ack(msg);
        } catch (error) {
          this.logger.error(
            'Falha ao processar mensagem da fila',
            (error as Error).stack,
          );
          this.channel.nack(msg, false, true);
        }
      })();
    });
  }
}

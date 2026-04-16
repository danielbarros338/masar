import { EntityManager } from 'typeorm';

export abstract class ITransactionManager {
  abstract run<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>;
}

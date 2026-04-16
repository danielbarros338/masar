import { Injectable } from '@nestjs/common';
import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

@Injectable()
export class Pbkdf2Util {
  private readonly iterations: number;
  private readonly keyLen: number;
  private readonly digest: string;
  private readonly saltLen: number;
  private readonly separator: string;

  constructor() {
    this.iterations = parseInt(process.env.PBKDF2_ITERATIONS!, 10);
    this.keyLen = parseInt(process.env.PBKDF2_KEY_LEN!, 10);
    this.digest = process.env.PBKDF2_DIGEST!;
    this.saltLen = parseInt(process.env.PBKDF2_SALT_LEN!, 10);
    this.separator = process.env.PBKDF2_SEPARATOR!;

    if (isNaN(this.iterations) || this.iterations <= 0) {
      throw new Error('Pbkdf2Util: PBKDF2_ITERATIONS inválido');
    }
    if (isNaN(this.keyLen) || this.keyLen <= 0) {
      throw new Error('Pbkdf2Util: PBKDF2_KEY_LEN inválido');
    }
    if (!this.digest) {
      throw new Error('Pbkdf2Util: PBKDF2_DIGEST inválido');
    }
    if (isNaN(this.saltLen) || this.saltLen <= 0) {
      throw new Error('Pbkdf2Util: PBKDF2_SALT_LEN inválido');
    }
    if (!this.separator) {
      throw new Error('Pbkdf2Util: PBKDF2_SEPARATOR inválido');
    }
  }

  async hash(value: string): Promise<string> {
    const salt = randomBytes(this.saltLen);
    const derived = await pbkdf2Async(
      value,
      salt,
      this.iterations,
      this.keyLen,
      this.digest,
    );
    return [
      this.iterations,
      salt.toString('hex'),
      derived.toString('hex'),
    ].join(this.separator);
  }

  async verify(value: string, stored: string): Promise<boolean> {
    const parts = stored.split(this.separator);
    if (parts.length !== 3) {
      throw new Error('Pbkdf2Util: formato de hash inválido');
    }

    const [iterationsRaw, saltHex, derivedHex] = parts;
    const iterations = parseInt(iterationsRaw, 10);

    if (isNaN(iterations) || iterations <= 0) {
      throw new Error(
        'Pbkdf2Util: número de iterações inválido no hash armazenado',
      );
    }

    const salt = Buffer.from(saltHex, 'hex');
    const storedDerived = Buffer.from(derivedHex, 'hex');
    const derived = await pbkdf2Async(
      value,
      salt,
      iterations,
      storedDerived.length,
      this.digest,
    );

    return timingSafeEqual(derived, storedDerived);
  }
}

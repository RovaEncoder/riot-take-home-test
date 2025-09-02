import { BadRequestException, Injectable } from '@nestjs/common';
import { DecryptedPayload, EncryptedPayload } from '../../helpers/constantes';
import { isPlainObject } from '../../helpers/utils';

export interface EncryptionStrategy {
  encrypt(payload: DecryptedPayload): EncryptedPayload;
  decrypt(payload: EncryptedPayload): DecryptedPayload;
}

export interface EncryptionStrategy {
  encrypt(payload: DecryptedPayload): EncryptedPayload;
  decrypt(payload: EncryptedPayload): DecryptedPayload;
}

@Injectable()
export class Base64EncryptionStrategy implements EncryptionStrategy {
  private encodeValue(value: unknown): string {
    const wrapped = { type: typeof value, value };
    return Buffer.from(JSON.stringify(wrapped)).toString('base64');
  }

  private decodeValue(value: string): string | number | object | null {
    try {
      const decodedUnknown: unknown = JSON.parse(
        Buffer.from(value, 'base64').toString('utf-8'),
      );

      if (
        !decodedUnknown ||
        typeof decodedUnknown !== 'object' ||
        !('type' in decodedUnknown) ||
        !('value' in decodedUnknown)
      ) {
        return value;
      }

      const decoded = decodedUnknown as { type: string; value: unknown };

      switch (decoded.type) {
        case 'number':
          return Number(decoded.value);
        case 'object':
          return decoded.value ?? null;
        default:
          if (
            typeof decoded.value === 'string' ||
            typeof decoded.value === 'number' ||
            typeof decoded.value === 'object' ||
            decoded.value === null
          ) {
            return decoded.value;
          }
          return decoded.value ?? null;
      }
    } catch {
      return value;
    }
  }

  encrypt(payload: DecryptedPayload): EncryptedPayload {
    if (!isPlainObject(payload)) {
      throw new BadRequestException('Input payload must be a plain object');
    }

    const result: EncryptedPayload = {};

    for (const key in payload) {
      try {
        const value = payload[key];

        result[key] = this.encodeValue(value);
      } catch {
        throw new BadRequestException(`Failed to encrypt key "${key}"`);
      }
    }

    return result;
  }

  decrypt(payload: EncryptedPayload): DecryptedPayload {
    if (!isPlainObject(payload)) {
      throw new BadRequestException('Input payload must be a plain object');
    }

    const result: DecryptedPayload = {};

    for (const key in payload) {
      result[key] = this.decodeValue(payload[key]);
    }

    return result;
  }
}

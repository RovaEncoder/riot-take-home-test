import { Inject, Injectable } from '@nestjs/common';
import type { EncryptionStrategy } from './strategies/encryption.strategy';
import {
  DecryptedPayload,
  EncryptedPayload,
  ENCRYPTION_STRATEGY,
} from '../helpers/constantes';

@Injectable()
export class EncryptionService {
  constructor(
    @Inject(ENCRYPTION_STRATEGY)
    private readonly strategy: EncryptionStrategy,
  ) {}

  encrypt(payload: DecryptedPayload): EncryptedPayload {
    return this.strategy.encrypt(payload);
  }

  decrypt(payload: EncryptedPayload): DecryptedPayload {
    return this.strategy.decrypt(payload);
  }
}

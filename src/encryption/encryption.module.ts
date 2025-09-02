import { Module } from '@nestjs/common';
import { EncryptionController } from './encryption.controller';
import { EncryptionService } from './encryption.service';
import { Base64EncryptionStrategy } from './strategies/encryption.strategy';
import { ENCRYPTION_STRATEGY } from '../helpers/constantes';

@Module({
  controllers: [EncryptionController],
  providers: [
    {
      provide: ENCRYPTION_STRATEGY,
      useClass: Base64EncryptionStrategy,
    },
    EncryptionService,
  ],
})
export class EncryptionModule {}

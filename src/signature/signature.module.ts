import { Module } from '@nestjs/common';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';
import { HmacStrategy } from './strategies/signature-hmac.strategy';

@Module({
  controllers: [SignatureController],
  providers: [SignatureService, HmacStrategy],
})
export class SignatureModule {}

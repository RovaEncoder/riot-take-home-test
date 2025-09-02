import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EncryptionModule } from './encryption/encryption.module';
import { SignatureModule } from './signature/signature.module';

const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: envFile }),
    EncryptionModule,
    SignatureModule,
  ],
})
export class AppModule {}

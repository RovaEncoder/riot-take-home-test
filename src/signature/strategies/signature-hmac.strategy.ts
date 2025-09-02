import { Injectable } from '@nestjs/common';
import { isPlainObject } from '../../helpers/utils';
import stringify from 'fast-json-stable-stringify';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'node:crypto';
import {
  SignRequestPayload,
  SignResponsePayload,
  VerifyRequestPayload,
} from '../../helpers/constantes';

export type SignReturn = { signature: string };
export type VerifyReturn = { signature: string; data: Record<string, unknown> };

export interface HmacSignature {
  sign(data: SignRequestPayload): SignResponsePayload;
  verify(input: VerifyRequestPayload): boolean;
}

@Injectable()
export class HmacStrategy implements HmacSignature {
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('HMAC_SECRET');
    if (!key) throw new Error('HMAC_SECRET is not defined');
    this.secretKey = key;
  }

  sign(data: Record<string, unknown>): SignResponsePayload {
    if (!isPlainObject(data)) throw new Error('Data must be a plain object');

    const json = stringify(data);
    const signature = createHmac('sha256', this.secretKey)
      .update(json)
      .digest('hex');

    return { signature };
  }

  verify({ data, signature }: VerifyRequestPayload): boolean {
    const expectedSignature = this.sign(data).signature;
    return expectedSignature === signature;
  }
}

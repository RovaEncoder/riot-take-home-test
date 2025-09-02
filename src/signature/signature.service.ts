import { Injectable } from '@nestjs/common';
import { HmacStrategy } from './strategies/signature-hmac.strategy';
import {
  SignRequestPayload,
  SignResponsePayload,
  VerifyRequestPayload,
} from '../helpers/constantes';

@Injectable()
export class SignatureService {
  constructor(private readonly hmacStrategy: HmacStrategy) {}

  sign(data: SignRequestPayload): SignResponsePayload {
    return this.hmacStrategy.sign(data);
  }

  verify(data: VerifyRequestPayload): boolean {
    return this.hmacStrategy.verify(data);
  }
}

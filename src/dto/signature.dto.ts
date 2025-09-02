import { ApiProperty } from '@nestjs/swagger';

export class SignResponseDto {
  @ApiProperty({
    example: '06e1f04910f8cadd9bc82ba90531e1229d936057832f4e4b1d0cb7e137d7a6da',
    description: 'HMAC signature of the payload',
    type: String,
  })
  signature: string;
}

export class VerifyRequestDto {
  @ApiProperty({
    description: 'Signature to verify',
    type: String,
    example: '06e1f04910f8cadd9bc82ba90531e1229d936057832f4e4b1d0cb7e137d7a6da',
  })
  signature: string;
  @ApiProperty({
    description: 'Payload with signature to verify',
    type: 'object',
    additionalProperties: true,
    example: {
      message: 'Hello World',
      timestamp: 1616161616,
    },
  })
  data: Record<string, any>;
}

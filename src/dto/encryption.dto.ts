import { ApiProperty } from '@nestjs/swagger';
import type { DecryptedPayload, EncryptedPayload } from '../helpers/constantes';

export class EncryptRequestDto {
  @ApiProperty({
    example: {
      name: 'John Doe',
      age: 30,
      contact: { email: 'john@example.com', phone: '123-456-7890' },
    },
    description: 'Payload to encrypt (depth 1)',
    type: Object,
  })
  payload: DecryptedPayload;
}

export class EncryptResponseDto {
  @ApiProperty({
    example: {
      payload: {
        name: 'eyJ0eXBlIjoic3RyaW5nIiwidmFsdWUiOiJKb2huIERvZSJ9',
        age: 'eyJ0eXBlIjoibnVtYmVyIiwidmFsdWUiOjMwfQ==',
        contact:
          'eyJ0eXBlIjoib2JqZWN0IiwidmFsdWUiOnsiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicGhvbmUiOiIxMjMtNDU2LTc4OTAifX0=',
      },
    },
    description: 'Encrypted payload',
    type: Object,
  })
  payload: EncryptedPayload;
}

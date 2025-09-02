import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';
import type { DecryptedPayload, EncryptedPayload } from '../helpers/constantes';

@ApiTags('encryption')
@Controller()
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('encrypt')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        name: 'John Doe',
        age: 30,
        contact: {
          email: 'john@example.com',
          phone: '123-456-7890',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Payload encrypted',
  })
  encryptData(@Body() payload: DecryptedPayload) {
    return this.encryptionService.encrypt(payload);
  }

  @Post('decrypt')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        name: 'eyJ0eXBlIjoic3RyaW5nIiwidmFsdWUiOiJKb2huIERvZSJ9',
        age: 'eyJ0eXBlIjoibnVtYmVyIiwidmFsdWUiOjMwfQ==',
        contact:
          'eyJ0eXBlIjoib2JqZWN0IiwidmFsdWUiOnsiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicGhvbmUiOiIxMjMtNDU2LTc4OTAifX0=',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payload decrypted',
  })
  decrypt(@Body() payload: EncryptedPayload) {
    return this.encryptionService.decrypt(payload);
  }
}

import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignatureService } from './signature.service';
import { SignResponseDto, VerifyRequestDto } from '../dto/signature.dto';

@ApiTags('signature')
@Controller()
export class SignatureController {
  constructor(private readonly signatureService: SignatureService) {}

  @Post('sign')
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        message: 'Hello World',
        timestamp: 1616161616,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Signed payload',
    type: SignResponseDto,
  })
  sign(@Body() body: Record<string, unknown>): SignResponseDto {
    return this.signatureService.sign(body);
  }

  @Post('verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'Signature is valid',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid signature',
  })
  verify(@Body() body: VerifyRequestDto): void {
    if (!body || !body.signature || !body.data) {
      throw new HttpException('Invalid payload', HttpStatus.BAD_REQUEST);
    }

    try {
      const isValid = this.signatureService.verify(body);
      if (!isValid) {
        throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
      }
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;

      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }

      throw new HttpException(
        `Verification failed: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

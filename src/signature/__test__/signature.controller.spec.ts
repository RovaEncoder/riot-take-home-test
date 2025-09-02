import { Test, TestingModule } from '@nestjs/testing';
import { SignatureController } from '../signature.controller';
import { SignatureService } from '../signature.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('SignatureController', () => {
  let controller: SignatureController;
  let service: SignatureService;

  const signatureRequest = { message: 'Hello World' };
  const signatureResponse = { signature: 'SIGNED_MESSAGE' };
  const verifyRequest = { data: signatureRequest, signature: 'SIGNED_MESSAGE' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignatureController],
      providers: [
        {
          provide: SignatureService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SignatureController>(SignatureController);
    service = module.get<SignatureService>(SignatureService);
  });

  it('should call sign on the service and return the signature', () => {
    (service.sign as jest.Mock).mockReturnValue(signatureResponse);

    const result = controller.sign(signatureRequest);

    expect(service.sign).toHaveBeenCalledWith(signatureRequest);
    expect(result).toEqual(signatureResponse);
  });

  it('should return nothing if signature is valid', () => {
    (service.verify as jest.Mock).mockReturnValue(true);

    const result = controller.verify(verifyRequest);

    expect(service.verify).toHaveBeenCalledWith(verifyRequest);
    expect(result).toBeUndefined();
  });

  it('should throw HttpException if signature is invalid', () => {
    (service.verify as jest.Mock).mockReturnValue(false);
    expect(() => controller.verify(verifyRequest)).toThrow(
      new HttpException('Invalid signature', HttpStatus.BAD_REQUEST),
    );
  });

  it('should throw HttpException on unexpected service error', () => {
    (service.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    expect(() => controller.verify(verifyRequest)).toThrow(
      new HttpException(
        'Verification failed: Unexpected error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );
  });
});

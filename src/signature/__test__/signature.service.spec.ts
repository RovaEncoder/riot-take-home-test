import { Test, TestingModule } from '@nestjs/testing';
import { SignatureService } from '../signature.service';
import { HmacStrategy } from '../strategies/signature-hmac.strategy';

describe('#SignatureService', () => {
  let service: SignatureService;
  let mockStrategy: Partial<HmacStrategy>;

  const unsignedPayload = { message: 'Hello World' };
  const signedPayload = { signature: 'SIGNED_MESSAGE' };
  const verifyRequest = { data: unsignedPayload, signature: 'SIGNED_MESSAGE' };

  beforeEach(async () => {
    mockStrategy = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignatureService,
        {
          provide: HmacStrategy,
          useValue: mockStrategy,
        },
      ],
    }).compile();

    service = module.get<SignatureService>(SignatureService);
  });

  describe('#sign', () => {
    it('should call sign on the strategy and return the signed result', () => {
      (mockStrategy.sign as jest.Mock).mockReturnValue(signedPayload);

      const result = service.sign(unsignedPayload);

      expect(mockStrategy.sign).toHaveBeenCalledWith(unsignedPayload);
      expect(result).toEqual(signedPayload);
    });
  });

  describe('#verify', () => {
    it('should call verify on the strategy and return true if signature is valid', () => {
      (mockStrategy.verify as jest.Mock).mockReturnValue(true);

      const result = service.verify(verifyRequest);

      expect(mockStrategy.verify).toHaveBeenCalledWith(verifyRequest);
      expect(result).toBe(true);
    });

    it('should call verify on the strategy and return false if signature is invalid', () => {
      (mockStrategy.verify as jest.Mock).mockReturnValue(false);

      const result = service.verify(verifyRequest);

      expect(mockStrategy.verify).toHaveBeenCalledWith(verifyRequest);
      expect(result).toBe(false);
    });
  });
});

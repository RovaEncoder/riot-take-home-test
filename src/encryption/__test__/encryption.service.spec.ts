import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from '../encryption.service';
import { ENCRYPTION_STRATEGY } from '../../helpers/constantes';
import { EncryptionStrategy } from '../strategies/encryption.strategy';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let mockStrategy: jest.Mocked<EncryptionStrategy>;

  const decryptedPayload = {
    name: 'John Doe',
    age: 30,
    contact: {
      email: 'john@example.com',
      phone: '123-456-7890',
    },
  };
  const encryptedPayload = {
    name: 'ENCRYPTED_NAME',
    age: 'ENCRYPTED_AGE',
    contact: 'ENCRYPTED_CONTACT',
  };
  beforeEach(async () => {
    mockStrategy = {
      encrypt: jest.fn(),
      decrypt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ENCRYPTION_STRATEGY,
          useValue: mockStrategy,
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should call encrypt on the strategy and return the result', () => {
    mockStrategy.encrypt.mockReturnValue(encryptedPayload);

    const result = service.encrypt(decryptedPayload);

    expect(mockStrategy.encrypt).toHaveBeenCalledWith(decryptedPayload);
    expect(result).toEqual(encryptedPayload);
  });

  it('should call decrypt on the strategy and return the result', () => {
    mockStrategy.decrypt.mockReturnValue(decryptedPayload);

    const result = service.decrypt(encryptedPayload);

    expect(mockStrategy.decrypt).toHaveBeenCalledWith(encryptedPayload);
    expect(result).toEqual(decryptedPayload);
  });
});

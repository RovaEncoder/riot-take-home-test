import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionController } from '../encryption.controller';
import { EncryptionService } from '../encryption.service';

describe('EncryptionController', () => {
  let controller: EncryptionController;
  let service: EncryptionService;

  const encodedPayload = {
    name: 'ENCODED_NAME',
    age: 'ENCODED_AGE',
    contact: 'ENCODED_CONTACT',
  };

  const decodedPayload = {
    name: 'John Doe',
    age: 30,
    contact: {
      email: 'john@example.com',
      phone: '123-456-7890',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncryptionController],
      providers: [
        {
          provide: EncryptionService,
          useValue: {
            encrypt: jest.fn(),
            decrypt: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EncryptionController>(EncryptionController);
    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should call encrypt on the service and return encrypted result', () => {
    (service.encrypt as jest.Mock).mockReturnValue(encodedPayload);

    const result = controller.encryptData(decodedPayload);

    expect(service.encrypt).toHaveBeenCalledWith(decodedPayload);
    expect(result).toEqual(encodedPayload);
  });

  it('should call decrypt on the service and return decrypted result', () => {
    (service.decrypt as jest.Mock).mockReturnValue(decodedPayload);

    const result = controller.decrypt(encodedPayload);

    expect(service.decrypt).toHaveBeenCalledWith(encodedPayload);
    expect(result).toEqual(decodedPayload);
  });
});

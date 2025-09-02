import { BadRequestException } from '@nestjs/common';
import { Base64EncryptionStrategy } from '../strategies/encryption.strategy';
import { DecryptedPayload, EncryptedPayload } from 'src/helpers/constantes';

describe('Base64EncryptionStrategy', () => {
  let strategy: Base64EncryptionStrategy;

  beforeEach(() => {
    strategy = new Base64EncryptionStrategy();
  });

  it('should encrypt and decrypt primitive values correctly', () => {
    const payload = {
      name: 'John Doe',
      age: 30,
      active: true,
    };

    const encrypted = strategy.encrypt(payload);

    expect(typeof encrypted.name).toBe('string');
    expect(typeof encrypted.age).toBe('string');
    expect(typeof encrypted.active).toBe('string');

    expect(encrypted).toEqual({
      name: 'eyJ0eXBlIjoic3RyaW5nIiwidmFsdWUiOiJKb2huIERvZSJ9',
      age: 'eyJ0eXBlIjoibnVtYmVyIiwidmFsdWUiOjMwfQ==',
      active: 'eyJ0eXBlIjoiYm9vbGVhbiIsInZhbHVlIjp0cnVlfQ==',
    });

    const decrypted = strategy.decrypt(encrypted);
    expect(decrypted).toEqual(payload);
  });

  it('should encrypt and decrypt nested objects at depth 1', () => {
    const payload = {
      name: 'John Doe',
      contact: {
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    };

    const encrypted = strategy.encrypt(payload);
    expect(typeof encrypted.name).toBe('string');
    expect(typeof encrypted.contact).toBe('string');

    expect(encrypted).toEqual({
      name: 'eyJ0eXBlIjoic3RyaW5nIiwidmFsdWUiOiJKb2huIERvZSJ9',
      contact:
        'eyJ0eXBlIjoib2JqZWN0IiwidmFsdWUiOnsiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicGhvbmUiOiIxMjMtNDU2LTc4OTAifX0=',
    });

    const decrypted = strategy.decrypt(encrypted);
    expect(decrypted).toEqual(payload);
  });

  it('should throw BadRequestException for non-object input on encrypt', () => {
    expect(() => strategy.encrypt(null as unknown as DecryptedPayload)).toThrow(
      BadRequestException,
    );
    expect(() =>
      strategy.encrypt('string' as unknown as DecryptedPayload),
    ).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for non-object input on decrypt', () => {
    expect(() => strategy.decrypt(null as unknown as EncryptedPayload)).toThrow(
      BadRequestException,
    );
    expect(() =>
      strategy.decrypt('string' as unknown as EncryptedPayload),
    ).toThrow(BadRequestException);
    expect(() =>
      strategy.decrypt([{ aray: 'test' }] as unknown as EncryptedPayload),
    ).toThrow(BadRequestException);
  });

  it('should handle invalid base64 gracefully during decrypt', () => {
    const invalidPayload = { key: 'not-base64' };
    const decrypted = strategy.decrypt(invalidPayload);
    expect(decrypted).toEqual({ key: 'not-base64' });
  });
});

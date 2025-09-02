import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  HmacStrategy,
  SignReturn,
  VerifyReturn,
} from '../strategies/signature-hmac.strategy';
import { createHmac } from 'node:crypto';
import stringify from 'fast-json-stable-stringify';
import { Test } from '@nestjs/testing';

describe('#HmacStrategy', () => {
  let strategy: HmacStrategy;
  let configService: ConfigService;
  let secretKey: string;

  beforeEach(() => {
    secretKey = 'secret_key';
    configService = {
      get: jest.fn().mockReturnValue(secretKey),
    } as unknown as ConfigService;
    strategy = new HmacStrategy(configService);
  });

  describe('#sign', () => {
    it('should sign a plain object correctly', () => {
      const data = { name: 'John', age: 30 };
      const result: SignReturn = strategy.sign(data);

      const json = stringify(data);
      const expectedSignature = createHmac('sha256', secretKey)
        .update(json)
        .digest('hex');

      expect(result).toEqual({ signature: expectedSignature });
    });

    it('should generate the same signature regardless of property order', () => {
      const data1 = { message: 'Hello World', timestamp: 1616161616 };
      const data2 = { timestamp: 1616161616, message: 'Hello World' };

      const sig1 = strategy.sign(data1);
      const sig2 = strategy.sign(data2);

      expect(sig1.signature).toBe(sig2.signature);
    });

    it('should throw error when signing non-plain object', () => {
      expect(() =>
        strategy.sign(null as unknown as Record<string, unknown>),
      ).toThrow('Data must be a plain object');
      expect(() =>
        strategy.sign('string' as unknown as Record<string, unknown>),
      ).toThrow('Data must be a plain object');
      expect(() =>
        strategy.sign([1, 2, 3] as unknown as Record<string, unknown>),
      ).toThrow('Data must be a plain object');
    });
  });

  describe('#verify', () => {
    it('should verify a valid signature', () => {
      const data = { name: 'John' };
      const { signature } = strategy.sign(data);
      const input: VerifyReturn = { data, signature };

      const isValid = strategy.verify(input);
      expect(isValid).toBe(true);
    });

    it('should fail verification for invalid signature', () => {
      const data = { name: 'John' };
      const input: VerifyReturn = { data, signature: 'invalid' };

      const isValid = strategy.verify(input);
      expect(isValid).toBe(false);
    });

    it('should handle corectly nested objects', () => {
      const data = { user: { name: 'John', roles: ['admin', 'user'] } };
      const { signature } = strategy.sign(data);
      const input: VerifyReturn = { data, signature };

      expect(strategy.verify(input)).toBe(true);
    });
  });
});

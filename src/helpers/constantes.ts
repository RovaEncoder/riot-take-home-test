export const ENCRYPTION_STRATEGY = Symbol('ENCRYPTION_STRATEGY');

export type EncryptedPayload = Record<string, string>;
export type DecryptedPayload = Record<string, unknown>;

export type SignRequestPayload = Record<string, unknown>;
export type SignResponsePayload = { signature: string };
export type VerifyRequestPayload = {
  signature: string;
  data: SignRequestPayload;
};

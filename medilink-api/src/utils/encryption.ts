import {
  EncryptedDataAesCbc256,
  aescbc,
  decodeFromString,
  encodeToString,
} from '@polybase/util';
import { Environment } from 'src/utils/Environment';

export async function encyptString(data: string): Promise<string> {
  const strDataToBeEncrypted = decodeFromString(data, 'utf8');

  const encryptedData = await aescbc.symmetricEncrypt(
    Environment.ENCRYPTION_KEY,
    strDataToBeEncrypted,
  );

  return JSON.stringify(encryptedData);
}

export async function decryptString(data: string): Promise<string> {
  const parsed = JSON.parse(data);

  const actual: EncryptedDataAesCbc256 = {
    version: parsed.version,
    nonce: new Uint8Array(
      Object.keys(parsed.nonce).map((item) => parsed.nonce[item]),
    ),
    ciphertext: new Uint8Array(
      Object.keys(parsed.ciphertext).map((item) => parsed.ciphertext[item]),
    ),
  };

  const decrypted = await aescbc.symmetricDecrypt(
    Environment.ENCRYPTION_KEY,
    actual,
  );
  return encodeToString(decrypted, 'utf8');
}

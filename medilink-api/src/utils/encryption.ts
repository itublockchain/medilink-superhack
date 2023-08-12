import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import {
  EncryptedDataAesCbc256,
  aescbc,
  decodeFromString,
  encodeToString,
} from '@polybase/util';
import { Environment } from 'src/utils/Environment';

export async function encryptString(data: string): Promise<string> {
  const strDataToBeEncrypted = decodeFromString(data, 'utf8');

  const encryptedData = await aescbc.symmetricEncrypt(
    Environment.ENCRYPTION_KEY,
    strDataToBeEncrypted,
  );

  return JSON.stringify(encryptedData);
}

export async function decryptString(data: string): Promise<string> {
  const schemaDecoder = new SchemaEncoder('string data');
  const decoded = schemaDecoder.decodeData(data)[0];
  const value = decoded.value.value;
  const parsed = JSON.parse(value.toString());

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
  const encoded = encodeToString(decrypted, 'utf8');
  const schemaEncoded = schemaDecoder.encodeData([
    { name: 'data', value: encoded, type: 'string' },
  ]);
  return schemaEncoded;
}

import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Injectable } from '@nestjs/common';
import request, { RequestDocument, Variables } from 'graphql-request';
import {
  AttestationByIdQuerySchema,
  AttestationsQuerySchema,
} from 'src/modules/eas/EasGraphQLSchemas';
import { getSigner } from 'src/utils/getRPCProvider';
import { Environment } from 'src/utils/Environment';
import {
  AttestationDto,
  AttestationResponseDto,
  CreateAttestationDto,
} from 'src/modules/eas/Eas.dto';
import { Interface, ethers } from 'ethers';
import { EAS_ABI } from 'src/utils/abi';
import { decryptString, encryptString } from 'src/utils/encryption';

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
@Injectable()
export class EasService {
  public async genNullableAttestation(
    attestationId: string,
  ): Promise<AttestationResponseDto> {
    const attestation = await this.graphqlRequest<AttestationResponseDto>(
      AttestationByIdQuerySchema,
      {
        id: attestationId,
      },
    );
    if (attestation.attestation == null) {
      return null;
    }

    try {
      const decryptedData = await decryptString(attestation.attestation.data);
      return {
        attestation: { ...attestation.attestation, data: decryptedData },
      };
    } catch {
      return attestation;
    }
  }

  public async genAttestations(
    attester: string,
  ): Promise<Array<AttestationDto>> {
    const response = await this.graphqlRequest<{
      attestations: Array<AttestationDto>;
    }>(AttestationsQuerySchema, {
      attester,
    });

    const decryptedData: Array<string> = [];
    for (const item of response.attestations) {
      try {
        const decrypted = await decryptString(item.data);
        decryptedData.push(decrypted);
      } catch (error) {
        console.log(error);
        decryptedData.push(item.data);
      }
    }

    return response.attestations.map((item, index) => {
      return {
        ...item,
        data: decryptedData[index],
      };
    });
  }

  public async genCreateAttestation(
    key: string,
    attestation: CreateAttestationDto,
  ): Promise<AttestationResponseDto> {
    const schemaUID = Environment.EAS_SCHEMA_UID;
    const easInterface = new Interface(EAS_ABI);

    const signer = getSigner(key);

    const contract = new ethers.Contract(
      Environment.EAS_CONTRACT,
      EAS_ABI,
      signer,
    );

    const tx = await contract.attest({
      schema: schemaUID,
      data: {
        recipient: attestation.recipient,
        expirationTime: 0,
        refUID: ZERO_BYTES32,
        revocable: true,
        data: await this.genEncodedData(attestation.data),
        value: 0,
      },
    });

    const receipt = await tx.wait();
    const log = receipt.logs[0];
    if (log == null) {
      return null;
    } else {
      const uid = easInterface.decodeEventLog(
        'Attested',
        log.data,
        log.topics,
      ).uid;

      return await this.genNullableAttestation(uid);
    }
  }

  public async genEncodedData(data: string): Promise<string> {
    const schemaEncoder = new SchemaEncoder('string data');
    const encrypted = await encryptString(data);
    const encodedData = schemaEncoder.encodeData([
      { name: 'data', value: encrypted, type: 'string' },
    ]);
    return encodedData;
  }

  public async graphqlRequest<T>(
    document: RequestDocument,
    variables?: Variables,
  ): Promise<T> {
    return request(this.getGraphQLUrl(), document, variables);
  }

  public getGraphQLUrl(): string {
    return 'https://optimism-goerli-bedrock.easscan.org/graphql';
  }
}

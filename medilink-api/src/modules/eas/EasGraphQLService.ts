import { RequestDocument, Variables, request } from 'graphql-request';
import {
  AttestationByIdQuerySchema,
  GraphqlResponse,
} from 'src/modules/eas/EasGraphQLSchemas';

import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Environment } from 'src/utils/Environment';
import { getRpcProvider } from 'src/utils/getRPCProvider';
import { AttestationDto } from 'src/modules/eas/Eas.dto';

export class EasGraphQLService {
  public static async genAttestation(
    attestationId: string,
  ): Promise<GraphqlResponse<AttestationDto>> {
    return await this.graphqlRequest(AttestationByIdQuerySchema, {
      id: attestationId,
    });
  }

  public static getEncodedData(eventId: string, ticketId: string): string {
    const schemaEncoder = new SchemaEncoder('string eventId, string ticketId');
    const encodedData = schemaEncoder.encodeData([
      { name: 'eventId', value: eventId, type: 'string' },
      { name: 'ticketId', value: ticketId, type: 'string' },
    ]);
    return encodedData;
  }

  public static getEasInstance(): EAS {
    const eas = new EAS(Environment.EAS_CONTRACT);
    const provider = getRpcProvider();
    eas.connect(provider);
    return eas;
  }

  public static async graphqlRequest<T>(
    document: RequestDocument,
    variables?: Variables,
  ): Promise<T> {
    return request(this.getGraphQLUrl(), document, variables);
  }

  public static getGraphQLUrl(): string {
    return 'https://easscan.org/graphql';
  }
}

import { gql } from 'graphql-request';

export type GraphqlResponse<T> = {
  data: T;
};

export const AttestationByIdQuerySchema = gql`
  query Attestation($id: String!) {
    attestation(where: { id: $id }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      time
    }
  }
`;

export const AttestationsQuerySchema = gql`
  query Attestations($attester: String!) {
    attestations(where: { attester: { equals: $attester } }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      time
    }
  }
`;

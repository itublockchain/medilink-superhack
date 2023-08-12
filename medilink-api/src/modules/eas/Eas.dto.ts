import { Attestation } from '@ethereum-attestation-service/eas-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class GetAttestationParams {
  @ApiProperty()
  uid: string;
}
export class CreateAttestationDto {
  @ApiProperty()
  recipient: string;

  @ApiProperty()
  revocable: boolean;

  @ApiProperty()
  expirationTime: string;

  @ApiProperty()
  data: string;
}

export class AttestationDto {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  schema: string;

  @ApiProperty()
  refUID: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  expirationTime: number;

  @ApiProperty()
  revocationTime: number;

  @ApiProperty()
  recipient: string;

  @ApiProperty()
  revocable: boolean;

  @ApiProperty()
  attester: string;

  @ApiProperty()
  data: string;
}

export class AttestationResponseDto {
  @ApiProperty({ nullable: true })
  attestation: AttestationDto | null;
}

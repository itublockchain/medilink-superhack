import { ApiProperty } from '@nestjs/swagger';

export class AttestationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  attester: string;

  @ApiProperty()
  recipient: string;

  @ApiProperty()
  refUID: string;

  @ApiProperty()
  revocable: string;

  @ApiProperty()
  revocationTime: string;

  @ApiProperty()
  expirationTime: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  version: number;
}

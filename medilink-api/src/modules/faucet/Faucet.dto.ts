import { ApiProperty } from '@nestjs/swagger';

export class FaucetRequestDto {
  @ApiProperty()
  address: string;
}

export class FaucetResponseDto {
  @ApiProperty()
  status: string;
}

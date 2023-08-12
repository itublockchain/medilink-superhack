import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import {
  AttestationResponseDto,
  CreateAttestationDto,
  GetAttestationParams,
} from 'src/modules/eas/Eas.dto';

import { EasService } from 'src/modules/eas/Eas.service';
import { DefaultApiOperation } from 'src/utils/docs';

@ApiTags('EAS')
@Controller('eas')
export class EasController {
  constructor(private easService: EasService) {}

  @ApiResponse({
    type: AttestationResponseDto,
  })
  @DefaultApiOperation('Get attestation by UID')
  @Get(':uid')
  public async genNullableAttestation(
    @Param() params: GetAttestationParams,
  ): Promise<AttestationResponseDto> {
    return await this.easService.genNullableAttestation(params.uid);
  }

  @ApiResponse({
    type: AttestationResponseDto,
  })
  @DefaultApiOperation('Get attestation by UID')
  @Post()
  public async genCreateAttestation(
    @Body() params: CreateAttestationDto,
    @Req() req: Request,
  ): Promise<AttestationResponseDto> {
    const key = req.headers.authorization;
    return await this.easService.genCreateAttestation(key, params);
  }
}

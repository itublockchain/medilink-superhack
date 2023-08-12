import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  FaucetRequestDto,
  FaucetResponseDto,
} from 'src/modules/faucet/Faucet.dto';

import { FaucetService } from 'src/modules/faucet/Faucet.service';
import { DefaultApiOperation } from 'src/utils/docs';

@ApiTags('Faucet')
@Controller('faucet')
export class FaucetController {
  constructor(private faucetService: FaucetService) {}

  @DefaultApiOperation('Make faucet request')
  @Post('')
  public async genFaucetRequest(
    @Body() body: FaucetRequestDto,
  ): Promise<FaucetResponseDto> {
    return await this.faucetService.genSendToken(body.address);
  }
}

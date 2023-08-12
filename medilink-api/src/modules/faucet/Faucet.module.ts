import { Module } from '@nestjs/common';
import { FaucetController } from 'src/modules/faucet/Faucet.controller';
import { FaucetService } from 'src/modules/faucet/Faucet.service';

@Module({
  imports: [],
  controllers: [FaucetController],
  providers: [FaucetService],
})
export class FaucetModule {}

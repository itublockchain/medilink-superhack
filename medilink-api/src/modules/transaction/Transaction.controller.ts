import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from 'src/modules/transaction/Transaction.service';
import { DefaultApiOperation } from 'src/utils/docs';
import axios from 'axios';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @DefaultApiOperation('Get transaction history (medical cards) of a user')
  @Get(':address')
  public async genMedicalCards(
    @Param('address') address: string,
  ): Promise<void> {
    await this.transactionService.genMedicalCards(address);
  }
}

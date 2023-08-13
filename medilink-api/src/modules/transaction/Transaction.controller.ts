import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from 'src/modules/transaction/Transaction.service';
import { DefaultApiOperation } from 'src/utils/docs';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @DefaultApiOperation('Get transaction history (medical cards) of a user')
  @Get(':address')
  public async genMedicalCards(
    @Param('address') address: string,
  ): Promise<unknown> {
    return await this.transactionService.genTransactionSummary(address);
  }
}

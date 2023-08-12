import { Module } from '@nestjs/common';
import { TransactionController } from 'src/modules/transaction/Transaction.controller';
import { TransactionService } from 'src/modules/transaction/Transaction.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}

import { Injectable } from '@nestjs/common';
import { Environment } from 'src/utils/Environment';
import axios from 'axios';

@Injectable()
export class TransactionService {
  public async genTransactionSummary(address: string): Promise<unknown> {
    const res = await axios.get(
      `https://api.covalenthq.com/v1/optimism-goerli/address/${address}/transactions_summary/`,
      {
        headers: {
          Authorization: `Bearer ${Environment.COVALENT_API_KEY}`,
        },
      },
    );
    const items = res.data.data.items;
    return items;
  }
}

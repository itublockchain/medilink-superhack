import { Injectable } from '@nestjs/common';
import { ethers, formatEther, parseEther } from 'ethers';
import { FaucetResponseDto } from 'src/modules/faucet/Faucet.dto';
import { Environment } from 'src/utils/Environment';
import { getSigner } from 'src/utils/getRPCProvider';

@Injectable()
export class FaucetService {
  public async genSendToken(address: string): Promise<FaucetResponseDto> {
    const provider = new ethers.JsonRpcProvider(Environment.NETWORK_RPC_URL);

    const balanceBigNumber = await provider.getBalance(address);
    const balance = formatEther(balanceBigNumber);

    if (Number(balance) > 0.001) {
      return { status: 'ok' };
    }

    try {
      const wallet = getSigner(Environment.PRIVATE_KEY);

      const tx = await wallet.sendTransaction({
        to: address,
        value: parseEther('0.002'),
      });
      await tx.wait();

      return { status: 'ok' };
    } catch {
      return { status: 'error' };
    }
  }
}

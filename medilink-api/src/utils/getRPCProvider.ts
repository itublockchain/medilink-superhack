import { ethers } from 'ethers';
import { Environment } from 'src/utils/Environment';

export type ProviderEventFilter = {
  address: string;
  topics: Array<string>;
};

export const getSigner = (key: string): ethers.Wallet => {
  const provider = new ethers.JsonRpcProvider(Environment.NETWORK_RPC_URL);
  const signer = new ethers.Wallet(key, provider);
  return signer;
};

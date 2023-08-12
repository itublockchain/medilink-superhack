import { ethers } from 'ethers';
import { Environment } from 'src/utils/Environment';

export type ProviderEventFilter = {
  address: string;
  topics: Array<string>;
};

type rpcProvider = ethers.JsonRpcProvider;

export const getRpcProvider = (): rpcProvider => {
  return new ethers.JsonRpcProvider(Environment.NETWORK_RPC_URL);
};

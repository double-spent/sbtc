import type { StacksNetwork, StacksNetworkName } from '@stacks/network';
import { StacksMainnet, StacksMocknet, StacksTestnet } from '@stacks/network';

export function getTransactionExplorerUrl(transactionId: string, network: StacksNetwork | StacksNetworkName) {
  if (network === 'mocknet' || network instanceof StacksMocknet) {
    return `https://explorer.hiro.so/txid/${transactionId}?chain=testnet&api=http://localhost:3999`;
  }

  if (network === 'testnet' || network instanceof StacksTestnet) {
    return `https://explorer.hiro.so/txid/${transactionId}?chain=testnet`;
  }

  if (network === 'mainnet' || network instanceof StacksMainnet) {
    return `https://explorer.hiro.so/txid/${transactionId}`;
  }

  return '#';
}

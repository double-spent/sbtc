import { SbtcNetwork } from '@double-spent/sbtc-core';
import type { StacksNetwork } from '@stacks/network';
import { StacksTestnet } from '@stacks/network';

export function sbtcNetworkFromStacks(network: StacksNetwork) {
  if (network instanceof StacksTestnet) {
    return SbtcNetwork.TESTNET;
  }

  throw new Error(`Network ${network.constructor.name} is not supported.`);
}

export function shortenStacksAddress(address: string) {
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

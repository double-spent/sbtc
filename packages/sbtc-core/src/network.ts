import { TESTNET, TestnetHelper } from 'sbtc';

import { SbtcUnsupportedNetworkError } from './errors';

export enum SbtcNetwork {
  TESTNET,
}

export function getSbtcApi(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return new TestnetHelper();

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

export function getSbtcNetwork(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return TESTNET;

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

import { TESTNET, TestnetHelper } from 'sbtc';

import { SbtcUnsupportedNetworkError } from './errors';

export enum SbtcNetwork {
  TESTNET,
}

/**
 * Gets the sBTC remote API for the specified network.
 *
 * @param network The network to use.
 *
 * @throws {SbtcUnsupportedNetworkError} An unsupported network was specified.
 */
export function getSbtcApi(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return new TestnetHelper();

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

/**
 * Gets the BTC network for the specified sBTC network.
 *
 * @param network The network to use.
 *
 * @throws {SbtcUnsupportedNetworkError} An unsupported network was specified.
 */
export function getBtcNetwork(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return TESTNET;

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

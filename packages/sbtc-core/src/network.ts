import { DevEnvHelper, REGTEST, TESTNET, TestnetHelper } from 'sbtc';

import { StacksDevnet, StacksTestnet } from '@stacks/network';

import { SbtcUnsupportedNetworkError } from './errors';

export enum SbtcNetwork {
  DEVNET,
  TESTNET,
  MAINNET,
}

type GetSbtcApiArgs =
  | {
      network: SbtcNetwork.DEVNET;
      config?: ConstructorParameters<typeof DevEnvHelper>[0];
    }
  | {
      network: SbtcNetwork.TESTNET;
      config?: ConstructorParameters<typeof TestnetHelper>[0];
    }
  | {
      network: SbtcNetwork.MAINNET;
    };

/**
 * Gets the sBTC remote API for the specified network.
 *
 * @param network The network to use.
 *
 * @throws {SbtcUnsupportedNetworkError} An unsupported network was specified.
 */
export function getSbtcApi(args: GetSbtcApiArgs) {
  switch (args.network) {
    case SbtcNetwork.TESTNET:
      return new TestnetHelper(args.config);

    case SbtcNetwork.DEVNET:
      return new DevEnvHelper(args.config);

    default:
      throw new SbtcUnsupportedNetworkError(args.network);
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

    case SbtcNetwork.DEVNET:
      return REGTEST;

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

/**
 * Gets the Stacks network for the specified sBTC network.
 *
 * @param network The network to use.
 *
 * @throws {SbtcUnsupportedNetworkError} An unsupported network was specified.
 */
export function getStacksNetwork(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return new StacksTestnet();

    case SbtcNetwork.DEVNET:
      return new StacksDevnet();

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

import { DevEnvHelper, REGTEST, SBTC_FT_ADDRESS_DEVENV, TESTNET, TestnetHelper } from 'sbtc';

import { StacksDevnet, StacksTestnet } from '@stacks/network';

import { TESTNET_SBTC_CONTRACT_ADDRESS } from './constants';
import { SbtcUnsupportedNetworkError } from './errors';

/**
 * Networks specific to the sBTC protocol.
 */
export enum SbtcNetwork {
  DEVNET,
  TESTNET,
  MAINNET,
}

export type GetSbtcApiArgs =
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
 * Gets the sBTC API instance.
 *
 * @param network The sBTC network.
 *
 * @throws {SbtcUnsupportedNetworkError} The specified network is not supported.
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
 * Gets the sBTC contract address.
 *
 * @param network The sBTC network.
 *
 * @throws {SbtcUnsupportedNetworkError} The specified network is not supported.
 */
export function getSbtcContractAddress(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return TESTNET_SBTC_CONTRACT_ADDRESS;

    case SbtcNetwork.DEVNET:
      return SBTC_FT_ADDRESS_DEVENV;

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

/**
 * Gets the BTC network for an sBTC network.
 *
 * @param network The sBTC network.
 *
 * @throws {SbtcUnsupportedNetworkError} The specified network is not supported.
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
 * Gets the Stacks network for an sBTC network.
 *
 * @param network The sBTC network.
 *
 * @throws {SbtcUnsupportedNetworkError} The specified network is not supported.
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

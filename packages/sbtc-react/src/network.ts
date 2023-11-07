import { SbtcNetwork, SbtcUnsupportedNetworkError } from '@double-spent/sbtc-core';

/**
 * Gets the network literal used by the `UserData` class for the provided sBTC network.
 */
export function getSbtcUserDataNetwork(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.DEVNET:
    case SbtcNetwork.TESTNET:
      return 'testnet';

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

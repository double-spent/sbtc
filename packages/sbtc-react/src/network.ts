import { SbtcNetwork, SbtcUnsupportedNetworkError } from '@double-spent/sbtc-core';

export function getSbtcUserDataNetwork(network: SbtcNetwork) {
  switch (network) {
    case SbtcNetwork.TESTNET:
      return 'testnet';

    default:
      throw new SbtcUnsupportedNetworkError(network);
  }
}

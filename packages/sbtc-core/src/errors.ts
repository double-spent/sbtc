import type { SbtcApiHelper } from 'sbtc';

import type { SbtcNetwork } from './network';

export class SbtcUnsupportedNetworkError extends Error {
  constructor(public readonly network: SbtcNetwork) {
    super(`Network ${network} is not supported.`);
  }
}

export class SbtcApiError extends Error {
  constructor(public readonly api: SbtcApiHelper, public readonly innerError: Error) {
    super(`Failed to call ${api.config.bitcoinElectrsApiUrl} with error: ${innerError.message}`);
  }
}

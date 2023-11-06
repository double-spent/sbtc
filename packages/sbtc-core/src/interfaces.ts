import type { SbtcApiHelper } from 'sbtc';

import type { StacksNetwork } from '@stacks/network';

/**
 * Parameters for a PSBT sign request.
 */
export type SbtcPsbtSignRequest = {
  publicKey: string;
  hex: string;
};

/**
 * Called when signing a PSBT transaction.
 */
export type SbtcSignPsbtCallback = (request: SbtcPsbtSignRequest) => Promise<string>;

/**
 * Parameters for a message sign request.
 */
export type SbtcMessageSignRequest = {
  message: string;
  stacksNetwork: StacksNetwork;
};

/**
 * Called when signing a message with a Stacks wallet.
 */
export type SbtcSignMessageCallback = (request: SbtcMessageSignRequest) => Promise<string>;

/**
 * The target fee rate to use for an sBTC transaction.
 */
export type SbtcDepositFeeRate = Parameters<SbtcApiHelper['estimateFeeRate']>[0];

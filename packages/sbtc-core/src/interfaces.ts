import type { SbtcApiHelper } from 'sbtc';

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
 * The target fee rate to use for an sBTC transaction.
 */
export type SbtcDepositFeeRate = Parameters<SbtcApiHelper['estimateFeeRate']>[0];

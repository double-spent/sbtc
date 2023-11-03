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

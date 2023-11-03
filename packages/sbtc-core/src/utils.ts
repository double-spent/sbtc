import BigNumber from 'bignumber.js';

/**
 * Converts an amount in BTC to SATS.
 *
 * @param btcAmount The amount to convert.
 * @returns The converted amount.
 */
export function convertBtcToSats(btcAmount: number) {
  return Number(BigInt(new BigNumber(btcAmount).shiftedBy(8).decimalPlaces(0).toString()));
}

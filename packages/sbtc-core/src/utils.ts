import BigNumber from 'bignumber.js';

/**
 * Converts an amount from BTC to SATS.
 *
 * @param btcAmount The BTC amount to convert.
 *
 * @returns The converted amount.
 */
export function convertBtcToSats(btcAmount: number) {
  return Number(BigInt(new BigNumber(btcAmount).shiftedBy(8).decimalPlaces(0).toString()));
}

/**
 * Converts an amount from SATS to BTC.
 *
 * @param btcAmount The SATS amount to convert.
 *
 * @returns The converted amount.
 */
export function convertSatsToBtc(satsAmount: number) {
  const BTC_PER_SAT = 1e-8;
  const btcAmount = satsAmount * BTC_PER_SAT;

  return btcAmount;
}

import BigNumber from 'bignumber.js';

export function convertBtcToSats(btc: number) {
  return Number(BigInt(new BigNumber(btc).shiftedBy(8).decimalPlaces(0).toString()));
}

import { sbtcWithdrawMessage } from 'sbtc';

import type { SbtcNetwork } from './network';
import { getBtcNetwork } from './network';

/**
 * Arguments for signing an sBTC withdrawal.
 */
export type SignSbtcWithdrawalArgs = {
  satsAmount: number;
  bitcoinAddress: string;
  network: SbtcNetwork;
  signMessage: (message: string) => Promise<string>;
};

/**
 * The result of signing an sBTC withdrawal.
 */
export type SignSbtcWithdrawalResult = {
  signedMessage: string;
};

/**
 * Signs an sBTC withdrawal.
 *
 * @param args.satsAmount       The amount in satoshis to withdraw.
 * @param args.bitcoinAddress   The sender's Bitcoin address to send the withdrawn BTC.
 * @param args.signMessage      The callback used to sign the message.
 * @param args.network          The network to use.
 *
 * @returns The signature.
 */
export async function signSbtcWithdrawal({ satsAmount, bitcoinAddress, network, signMessage }: SignSbtcWithdrawalArgs) {
  const message = sbtcWithdrawMessage({
    network: getBtcNetwork(network),
    amountSats: satsAmount,
    bitcoinAddress,
  });

  const signature = await signMessage(message);

  return {
    signature,
  };
}

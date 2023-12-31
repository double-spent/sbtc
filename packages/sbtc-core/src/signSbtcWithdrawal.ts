import { sbtcWithdrawMessage } from 'sbtc';

import type { SbtcSignMessageCallback } from './interfaces';
import type { SbtcNetwork } from './network';
import { getBtcNetwork, getStacksNetwork } from './network';

/**
 * Arguments for signing an sBTC withdrawal.
 */
export type SignSbtcWithdrawalArgs = {
  satsAmount: number;
  bitcoinAddress: string;
  network: SbtcNetwork;
  signMessage: SbtcSignMessageCallback;
};

/**
 * Result from signing an sBTC withdrawal.
 */
export type SignSbtcWithdrawalResult = {
  /**
   * The withdrawal signature.
   */
  signature: string;
};

/**
 * Signs an sBTC withdrawal.
 *
 * @param args.satsAmount       The amount in satoshis to withdraw.
 * @param args.bitcoinAddress   The sender's Bitcoin address to send the withdrawn BTC.
 * @param args.signMessage      The callback used to sign the message.
 * @param args.network          The network to use.
 */
export async function signSbtcWithdrawal({ satsAmount, bitcoinAddress, network, signMessage }: SignSbtcWithdrawalArgs) {
  const stacksNetwork = getStacksNetwork(network);

  const message = sbtcWithdrawMessage({
    network: getBtcNetwork(network),
    amountSats: satsAmount,
    bitcoinAddress,
  });

  const signature = await signMessage({ message, stacksNetwork });

  return {
    signature,
  };
}

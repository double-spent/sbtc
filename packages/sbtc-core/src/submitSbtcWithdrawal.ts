import type { UtxoWithTx } from 'sbtc';
import { sbtcWithdrawHelper } from 'sbtc';

import { Transaction as BtcTransaction } from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';

import { SbtcApiError } from './errors';
import type { SbtcDepositFeeRate, SbtcSignPsbtCallback } from './interfaces';
import { getBtcNetwork, getSbtcApi, type SbtcNetwork } from './network';

/**
 * Arguments for submitting an sBTC withdrawal.
 */
export type SubmitSbtcWithdrawalArgs = {
  signature: string;
  satsAmount: number;
  network: SbtcNetwork;
  bitcoinAddress: string;
  bitcoinPublicKey: string;
  feeRateTarget?: SbtcDepositFeeRate;
  signPsbt: SbtcSignPsbtCallback;
};

/**
 * Result from submitting an sBTC withdrawal.
 */
export type SubmitSbtcWithdrawalResult = {
  /**
   * The hash of the Bitcoin transaction.
   */
  btcTransactionHash: string;
};

/**
 * Submits an sBTC withdrawal. To submit a withdrawal, it has to be authorized
 * by signing a message first. Use `signSbtcWithdrawal` to create the signature and
 * pass it in the arguments.
 *
 * @param args.signature        The signature authorizing the withdrawal.
 * @param args.satsAmount       The amount in satoshis to withdraw.
 * @param args.bitcoinAddress   The sender's Bitcoin address to send the withdrawn BTC.
 * @param args.bitcoinPublicKey The sender's Bitcoin public key used to sign the withdraw PSBT.
 * @param args.signPsbt         The callback used to sign PSBTs before broadcasting the withdrawal.
 * @param args.network          The network to use.
 * @param args.feeRateTarget    The target fee rate to use (low, medium, high).
 *
 * @throws {SbtcApiError} Failed to fetch from the sBTC API.
 */
export async function submitSbtcWithdrawal({
  network,
  signature,
  satsAmount,
  bitcoinAddress,
  bitcoinPublicKey,
  feeRateTarget = 'low',
  signPsbt,
}: SubmitSbtcWithdrawalArgs): Promise<SubmitSbtcWithdrawalResult> {
  const api = getSbtcApi({ network });

  let utxos: UtxoWithTx[];
  let pegAddress: string;
  let feeRate: number;

  try {
    [utxos, pegAddress, feeRate] = await Promise.all([
      api.fetchUtxos(bitcoinAddress),
      api.getSbtcPegAddress(),
      api.estimateFeeRate(feeRateTarget),
    ]);
  } catch (error) {
    throw new SbtcApiError(api, error as Error);
  }

  const transaction = await sbtcWithdrawHelper({
    bitcoinChangeAddress: bitcoinAddress,
    network: getBtcNetwork(network),
    fulfillmentFeeSats: 2000,
    amountSats: satsAmount,
    bitcoinAddress,
    pegAddress,
    signature,
    feeRate,
    utxos,
  });

  const psbt = transaction.toPSBT();

  const signedPsbt = await signPsbt({
    publicKey: bitcoinPublicKey,
    hex: bytesToHex(psbt),
  });

  const formattedTransaction = BtcTransaction.fromPSBT(hexToBytes(signedPsbt));

  formattedTransaction.finalize();

  let broadcastedTransactionHash: string;

  try {
    broadcastedTransactionHash = await api.broadcastTx(formattedTransaction);
  } catch (error) {
    throw new SbtcApiError(api, error as Error);
  }

  return {
    btcTransactionHash: broadcastedTransactionHash,
  };
}

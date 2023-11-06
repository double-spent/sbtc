import type { UtxoWithTx } from 'sbtc';
import { sbtcWithdrawHelper } from 'sbtc';

import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';

import { SbtcApiError } from './errors';
import type { SbtcDepositFeeRate, SbtcSignPsbtCallback } from './interfaces';
import { getBtcNetwork, getSbtcApi, type SbtcNetwork } from './network';

/**
 * Arguments for an sBTC withdrawal.
 */
export type SubmitSbtcWithdrawalArgs = {
  signature: string;
  satsAmount: number;
  network: SbtcNetwork;
  bitcoinAddress: string;
  bitcoinPublicKey: string;
  feeRate?: SbtcDepositFeeRate;
  signPsbt: SbtcSignPsbtCallback;
};

/**
 * The result of an sBTC withdrawal.
 */
export type SubmitSbtcWithdrawalResult = {
  btcTransactionHash: string;
};

/**
 * Initiates and broadcasts an sBTC withdrawal to the network. To submit a withdrawal, it has to
 * be authorized by signing a message. Use `signSbtcWithdrawal` to create the signature.
 *
 * @param args.signature        The signature authorizing the withdrawal.
 * @param args.satsAmount       The amount in satoshis to withdraw.
 * @param args.bitcoinAddress   The sender's Bitcoin address to send the withdrawn BTC.
 * @param args.bitcoinPublicKey The sender's Bitcoin public key used to sign the withdraw PSBT.
 * @param args.signPsbt         The callback used to sign PSBTs before broadcasting the withdrawal.
 * @param args.network          The network to use.
 *
 * @returns The Bitcoin transaction hash.
 *
 * @throws {SbtcApiError} Failed to fetch from the sBTC API.
 */
export async function submitSbtcWithdrawal({
  network,
  signature,
  satsAmount,
  bitcoinAddress,
  bitcoinPublicKey,
  feeRate: feeRateTarget = 'low',
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

  const formattedTransaction = btc.Transaction.fromPSBT(hexToBytes(signedPsbt));

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

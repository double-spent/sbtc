import type { UtxoWithTx } from 'sbtc';
import { sbtcDepositHelper } from 'sbtc';

import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';

import { SbtcApiError } from './errors';
import type { SbtcSignPsbtCallback } from './interfaces';
import type { SbtcNetwork } from './network';
import { getBtcNetwork, getSbtcApi } from './network';

/**
 * Arguments for an sBTC deposit.
 */
export type DepositSbtcArgs = {
  satsAmount: number;
  stacksAddress: string;
  bitcoinAddress: string;
  bitcoinPublicKey: string;
  network: SbtcNetwork;
  signPsbt: SbtcSignPsbtCallback;
};

/**
 * The result of an sBTC deposit.
 */
export type DepositSbtcResult = {
  btcTransactionHash: string;
};

/**
 * Initiates and broadcasts an sBTC deposit to the network.
 *
 * @param args.satsAmount       The amount in satoshis to deposit.
 * @param args.stacksAddress    The sender's Stacks address where the sBTC will be sent.
 * @param args.bitcoinAddress   The sender's Bitcoin address where the BTC is deposited from.
 * @param args.bitcoinPublicKey The sender's Bitcoin public key used to sign the deposit PSBT.
 * @param args.signPsbt         The callback used to sign PSBTs before broadcasting the deposit.
 * @param args.network          The network to use.
 *
 * @returns The Bitcoin transaction hash.
 *
 * @throws {SbtcApiError} Failed to fetch from the sBTC API.
 */
export async function depositSbtc({
  satsAmount,
  stacksAddress,
  bitcoinAddress,
  bitcoinPublicKey,
  network,
  signPsbt,
}: DepositSbtcArgs): Promise<DepositSbtcResult> {
  const api = getSbtcApi(network);

  let utxos: UtxoWithTx[];
  let pegAddress: string;
  let feeRate: number;

  try {
    [utxos, pegAddress, feeRate] = await Promise.all([
      api.fetchUtxos(bitcoinAddress),
      api.getSbtcPegAddress(),
      api.estimateFeeRate('low'),
    ]);
  } catch (error) {
    throw new SbtcApiError(api, error as Error);
  }

  const transaction = await sbtcDepositHelper({
    network: getBtcNetwork(network),
    bitcoinChangeAddress: bitcoinAddress,
    amountSats: satsAmount,
    stacksAddress,
    pegAddress,
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

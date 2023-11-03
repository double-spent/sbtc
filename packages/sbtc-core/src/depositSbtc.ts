import type { UtxoWithTx } from 'sbtc';
import { sbtcDepositHelper } from 'sbtc';

import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';

import { SbtcApiError } from './errors';
import type { SbtcSignPsbtCallback } from './interfaces';
import type { SbtcNetwork } from './network';
import { getSbtcApi, getSbtcNetwork } from './network';

export type DepositSbtcArgs = {
  satsAmount: number;
  stacksAddress: string;
  bitcoinAddress: string;
  bitcoinPublicKey: string;
  network: SbtcNetwork;
  signPsbt: SbtcSignPsbtCallback;
};

export type DepositSbtcResult = {
  btcTransactionHash: string;
};

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
    network: getSbtcNetwork(network),
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

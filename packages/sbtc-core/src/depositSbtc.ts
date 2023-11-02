import type { UtxoWithTx } from 'sbtc';
import { sbtcDepositHelper } from 'sbtc';

import * as btc from '@scure/btc-signer';
import { bytesToHex, hexToBytes } from '@stacks/common';

import type { SbtcContext } from './config';
import { SbtcApiError, SbtcInvalidUserError } from './errors';
import { getSbtcApi, getSbtcNetwork, getSbtcUserDataNetwork } from './network';

export type DepositSbtcArgs = {
  satsAmount: number;
  context: SbtcContext;
};

export type DepositSbtcResult = {
  btcTransactionHash: string;
};

export async function depositSbtc({ satsAmount, context }: DepositSbtcArgs): Promise<DepositSbtcResult> {
  const { user, network, signPsbt } = context;

  if (!user) {
    throw new SbtcInvalidUserError();
  }

  const api = getSbtcApi(network);
  const userDataNetwork = getSbtcUserDataNetwork(network);

  const stxAddress = user.profile.stxAddress[userDataNetwork];
  const btcAddress = user.profile.btcAddress.p2wpkh[userDataNetwork];
  const btcPublicKey = user.profile.btcPublicKey.p2wpkh;

  let utxos: UtxoWithTx[];
  let pegAddress: string;
  let feeRate: number;

  try {
    [utxos, pegAddress, feeRate] = await Promise.all([
      api.fetchUtxos(btcAddress),
      api.getSbtcPegAddress(),
      api.estimateFeeRate('low'),
    ]);
  } catch (error) {
    throw new SbtcApiError(api, error as Error);
  }

  const transaction = await sbtcDepositHelper({
    network: getSbtcNetwork(network),
    bitcoinChangeAddress: btcAddress,
    stacksAddress: stxAddress,
    amountSats: satsAmount,
    pegAddress,
    feeRate,
    utxos,
  });

  const psbt = transaction.toPSBT();

  const signedPsbt = await signPsbt({
    publicKey: btcPublicKey,
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

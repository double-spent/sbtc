import { useCallback } from 'react';

import type { SbtcNetwork, SubmitSbtcWithdrawalResult } from '@double-spent/sbtc-core';
import { submitSbtcWithdrawal as coreSubmitSbtcWithdrawal } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

export type UseSubmitSbtcWithdrawResult = {
  /**
   * The sBTC network.
   */
  network: SbtcNetwork;

  /**
   * Submits the sBTC withdrawal.
   *
   * @param satsAmount The amount in sats.
   * @param signature The withdrawal signature.
   *
   * @returns The result of submitting the withdrawal.
   */
  submitSbtcWithdrawal: (satsAmount: number, signature: string) => Promise<SubmitSbtcWithdrawalResult>;
};

/**
 * Submits an sBTC withdrawal. To submit a withdrawal, it has to be authorized by signing a message first. Use
 * `useSignSbtcWithdrawal` to create the signature.
 *
 * @throws {SbtcUserNotFoundError} No user context was provided (no Stacks wallet is connected.)
 */
export function useSubmitSbtcWithdrawal(): UseSubmitSbtcWithdrawResult {
  const { network, user, signPsbt } = useSbtc();

  const submitSbtcWithdrawal = useCallback(
    (satsAmount: number, signature: string) => {
      if (!user) {
        throw new SbtcUserNotFoundError();
      }

      const userDataNetwork = getSbtcUserDataNetwork(network);

      const bitcoinAddress = user.profile.btcAddress.p2wpkh[userDataNetwork];
      const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

      return coreSubmitSbtcWithdrawal({
        network,
        bitcoinAddress,
        bitcoinPublicKey,
        satsAmount,
        signature,
        signPsbt,
      });
    },
    [network, signPsbt, user],
  );

  return {
    network,
    submitSbtcWithdrawal,
  };
}

import { useCallback } from 'react';

import type { SbtcNetwork, SubmitSbtcWithdrawalResult } from '@double-spent/sbtc-core';
import {
  signSbtcWithdrawal as coreSignSbtcWithdrawal,
  submitSbtcWithdrawal as coreSubmitSbtcWithdrawal,
} from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcSignWithdrawalError, SbtcSubmitWithdrawalError, SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

/**
 * Result of signing and submitting an sBTC withdrawal.
 */
export type SignAndSubmitSbtcWithdrawalResult = SubmitSbtcWithdrawalResult;

export type UseSignAndSubmitSbtcWithdrawResult = {
  /**
   * The sBTC network.
   */
  network: SbtcNetwork;

  /**
   * Submits the sBTC withdrawal.
   *
   * @param satsAmount The amount in sats.
   *
   * @throws {SbtcSignWithdrawalError} Failed to sign the withdrawal.
   * @throws {SbtcSubmitWithdrawalError} Failed to submit the withdrawal.
   *
   * @returns The result of submitting the withdrawal.
   */
  signAndSubmitSbtcWithdrawal: (satsAmount: number) => Promise<SignAndSubmitSbtcWithdrawalResult>;
};

/**
 * Signs and submits an sBTC withdrawal.
 *
 * @throws {SbtcUserNotFoundError} No user context was provided (no Stacks wallet is connected.)
 */
export function useSubmitSbtcWithdrawal(): UseSignAndSubmitSbtcWithdrawResult {
  const { network, user, signPsbt, signMessage } = useSbtc();

  const submitSbtcWithdrawal = useCallback(
    async (satsAmount: number) => {
      if (!user) {
        throw new SbtcUserNotFoundError();
      }

      const userDataNetwork = getSbtcUserDataNetwork(network);

      const bitcoinAddress = user.profile.btcAddress.p2wpkh[userDataNetwork];
      const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

      let signature;

      try {
        ({ signature } = await coreSignSbtcWithdrawal({
          network,
          bitcoinAddress,
          satsAmount,
          signMessage,
        }));
      } catch (error) {
        throw new SbtcSignWithdrawalError(error as Error);
      }

      try {
        return coreSubmitSbtcWithdrawal({
          network,
          bitcoinAddress,
          bitcoinPublicKey,
          satsAmount,
          signature,
          signPsbt,
        });
      } catch (error) {
        throw new SbtcSubmitWithdrawalError(error as Error);
      }
    },
    [network, signMessage, signPsbt, user],
  );

  return {
    network,
    signAndSubmitSbtcWithdrawal: submitSbtcWithdrawal,
  };
}

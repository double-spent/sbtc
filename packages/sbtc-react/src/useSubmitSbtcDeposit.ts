import { useCallback } from 'react';

import type { SbtcNetwork, SubmitSbtcDepositResult } from '@double-spent/sbtc-core';
import { submitSbtcDeposit as coreSubmitSbtcDeposit } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcSubmitDepositError, SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

export type UseSubmitSbtcDepositResult = {
  /**
   * The sBTC network.
   */
  network: SbtcNetwork;

  /**
   * Submits the sBTC deposit.
   *
   * @param satsAmount The amount in sats.
   *
   * @returns The result of submitting the deposit.
   *
   * @throws {SbtcSignDepositError} Failed to submit the deposit.
   */
  submitSbtcDeposit: (satsAmount: number) => Promise<SubmitSbtcDepositResult>;
};

/**
 * Submits an sBTC deposit.
 *
 * @throws {SbtcUserNotFoundError} No user context was provided (no Stacks wallet is connected.)
 */
export function useSubmitSbtcDeposit(): UseSubmitSbtcDepositResult {
  const { network, user, signPsbt } = useSbtc();

  const submitSbtcDeposit = useCallback(
    (satsAmount: number) => {
      if (!user) {
        throw new SbtcUserNotFoundError();
      }

      const userDataNetwork = getSbtcUserDataNetwork(network);

      const stacksAddress = user.profile.stxAddress[userDataNetwork];
      const bitcoinAddress = user.profile.btcAddress.p2wpkh[userDataNetwork];
      const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

      try {
        return coreSubmitSbtcDeposit({
          network,
          stacksAddress,
          bitcoinAddress,
          bitcoinPublicKey,
          satsAmount,
          signPsbt,
        });
      } catch (error) {
        throw new SbtcSubmitDepositError(error as Error);
      }
    },
    [network, signPsbt, user],
  );

  return {
    network,
    submitSbtcDeposit,
  };
}

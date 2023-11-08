import { useCallback } from 'react';

import type { SbtcNetwork, SignSbtcWithdrawalResult } from '@double-spent/sbtc-core';
import { signSbtcWithdrawal as coreSignSbtcWithdrawal } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

export type UseSignSbtcWithdrawalResult = {
  /**
   * The sBTC network.
   */
  network: SbtcNetwork;

  /**
   * Signs the sBTC withdrawal.
   *
   * @param satsAmount The amount in sats.
   *
   * @returns The result of signing the sBTC withdrawal.
   */
  signSbtcWithdrawal: (satsAmount: number) => Promise<SignSbtcWithdrawalResult>;
};

/**
 * Signs an sBTC withdrawal.
 *
 * @throws {SbtcUserNotFoundError} No user context was provided (no Stacks wallet is connected.)
 */
export function useSignSbtcWithdrawal(): UseSignSbtcWithdrawalResult {
  const { network, user, signMessage } = useSbtc();

  const signSbtcWithdrawal = useCallback(
    (satsAmount: number) => {
      if (!user) {
        throw new SbtcUserNotFoundError();
      }

      const userDataNetwork = getSbtcUserDataNetwork(network);
      const bitcoinAddress = user.profile.btcAddress.p2wpkh[userDataNetwork];

      return coreSignSbtcWithdrawal({
        network,
        bitcoinAddress,
        satsAmount,
        signMessage,
      });
    },
    [network, signMessage, user],
  );

  return {
    network,
    signSbtcWithdrawal,
  };
}

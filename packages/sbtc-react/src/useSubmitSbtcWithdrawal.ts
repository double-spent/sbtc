import { useCallback } from 'react';

import { submitSbtcWithdrawal as coreSubmitSbtcWithdrawal } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

/**
 * Submits an sBTC withdrawal.
 *
 * @throws {SbtcUserNotFoundError} No user context was provided (no Stacks wallet is connected.)
 */
export function useSubmitSbtcWithdrawal() {
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

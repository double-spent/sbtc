import { useCallback } from 'react';

import { submitSbtcDeposit as coreSubmitSbtcDeposit } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

export function useSubmitSbtcDeposit() {
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

      return coreSubmitSbtcDeposit({
        network,
        stacksAddress,
        bitcoinAddress,
        bitcoinPublicKey,
        satsAmount,
        signPsbt,
      });
    },
    [network, signPsbt, user],
  );

  return {
    network,
    submitSbtcDeposit,
  };
}

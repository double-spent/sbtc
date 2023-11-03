import { useCallback } from 'react';

import { depositSbtc as coreDepositSbtc } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

export function useDepositSbtc() {
  const { network, user, signPsbt } = useSbtc();

  const depositSbtc = useCallback(
    (satsAmount: number) => {
      if (!user) {
        throw new SbtcUserNotFoundError();
      }

      const userDataNetwork = getSbtcUserDataNetwork(network);

      const stacksAddress = user.profile.stxAddress[userDataNetwork];
      const bitcoinAddress = user.profile.btcAddress.p2wpkh[userDataNetwork];
      const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

      return coreDepositSbtc({
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
    depositSbtc,
  };
}

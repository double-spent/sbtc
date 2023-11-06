import { useCallback } from 'react';

import { signSbtcWithdrawal as coreSignSbtcWithdrawal } from '@double-spent/sbtc-core';

import { useSbtc } from './context';
import { SbtcUserNotFoundError } from './errors';
import { getSbtcUserDataNetwork } from './network';

export function useSignSbtcWithdrawal() {
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

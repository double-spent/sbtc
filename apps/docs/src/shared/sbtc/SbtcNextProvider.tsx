import { type ReactNode } from 'react';

import type { SbtcPsbtSignRequest } from '@double-spent/sbtc-core';
import { SBtcProvider } from '@double-spent/sbtc-react';

import { useStacksSession } from '../stacks';
import { sbtcNetworkFromStacks } from '../utils';

export type SbtcNextProviderProps = {
  children: ReactNode;
};

export function SbtcNextProvider({ children }: SbtcNextProviderProps) {
  const { network, userSession } = useStacksSession();

  const signPsbt = async (request: SbtcPsbtSignRequest) => {
    const response = await (window as any).btc.request('signPsbt', request);
    const psbt = response.result.hex;

    return psbt;
  };

  const sbtcProviderOptions = {
    signPsbt,
    network: sbtcNetworkFromStacks(network),
    user: userSession?.loadUserData(),
  };

  return <SBtcProvider {...sbtcProviderOptions}>{children}</SBtcProvider>;
}

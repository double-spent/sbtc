import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { SbtcNetwork, SbtcSignMessageCallback, SbtcSignPsbtCallback } from '@double-spent/sbtc-core';
import { type UserData } from '@stacks/connect';

import { SbtcContextMissingError } from './errors';

export type SbtcContext = {
  user?: UserData;
  network: SbtcNetwork;
  signPsbt: SbtcSignPsbtCallback;
  signMessage: SbtcSignMessageCallback;
};

export const SbtcContext = createContext<SbtcContext | undefined>(undefined);

export function SBtcProvider({ children, ...context }: SbtcContext & { children: ReactNode }) {
  return <SbtcContext.Provider value={context}>{children}</SbtcContext.Provider>;
}

export function useSbtc() {
  const sbtc = useContext(SbtcContext);

  if (!sbtc) {
    throw new SbtcContextMissingError();
  }

  return sbtc;
}

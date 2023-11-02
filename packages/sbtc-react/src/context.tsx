import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { SbtcContext as CoreSbtcContext } from '@double-spent/sbtc-core';

import { SbtcContextMissingError } from './errors';

export const SbtcContext = createContext<CoreSbtcContext | undefined>(undefined);

export function SBtcProvider({ children, ...context }: CoreSbtcContext & { children: ReactNode }) {
  return <SbtcContext.Provider value={context}>{children}</SbtcContext.Provider>;
}

export function useSbtc() {
  const sbtc = useContext(SbtcContext);

  if (!sbtc) {
    throw new SbtcContextMissingError();
  }

  return sbtc;
}

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { SbtcNetwork, SbtcSignMessageCallback, SbtcSignPsbtCallback } from '@double-spent/sbtc-core';
import { type UserData } from '@stacks/connect';

import { SbtcContextMissingError } from './errors';

/**
 * Contains components required for sBTC transactions.
 */
export type SbtcContext = {
  /**
   * The user data of the connected Stacks wallet, if any.
   */
  user?: UserData;

  /**
   * The active network.
   */
  network: SbtcNetwork;

  /**
   * The callback used to sign Bitcoin PSBTs.
   */
  signPsbt: SbtcSignPsbtCallback;

  /**
   * The callback used to sign messages.
   */
  signMessage: SbtcSignMessageCallback;
};

/**
 * Context used for sBTC transactions.
 */
export const SbtcContext = createContext<SbtcContext | undefined>(undefined);

/**
 * Provides context for sBTC transactions.
 */
export function SBtcProvider({ children, ...context }: SbtcContext & { children: ReactNode }) {
  return <SbtcContext.Provider value={context}>{children}</SbtcContext.Provider>;
}

/**
 * Gets the sBTC context from the component tree.
 *
 * @throws {SbtcContextMissingError} No instance of `SbtcContext` is present in the component tree.
 */
export function useSbtc() {
  const sbtc = useContext(SbtcContext);

  if (!sbtc) {
    throw new SbtcContextMissingError();
  }

  return sbtc;
}

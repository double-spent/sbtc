import type { ReactNode } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

import { AppConfig, showConnect, UserSession } from '@stacks/connect';
import type { StacksNetwork } from '@stacks/network';
import { StacksTestnet } from '@stacks/network';

import type { StacksUser } from './types';

export type StacksContext = (
  | { isConnected: false; user: null; userSession: null }
  | {
      isConnected: true;
      user: StacksUser;
      userSession: UserSession;
    }
) & {
  signOut: () => void;
  authenticate: () => Promise<void>;
  network: StacksNetwork;
};

export const StacksContext = createContext<StacksContext | null>(null);

export type StacksProps = {
  children: ReactNode;
};

export function Stacks({ children }: StacksProps) {
  const [user, setUser] = useState<StacksUser | null>(null);

  const appConfig = useMemo(() => new AppConfig(['store_write', 'publish_data']), []);
  const userSession = useMemo(() => new UserSession({ appConfig }), [appConfig]);

  const network = new StacksTestnet();

  const authenticate = async () => {
    const appDetails = {
      name: 'sBTC',
      icon: 'https://freesvg.org/img/1541103084.png',
    };

    showConnect({
      appDetails,
      userSession,
      onFinish: () => window.location.reload(),
    });
  };

  const signOut = () => {
    userSession.signUserOut('/');
  };

  useEffect(() => {
    const signIn = async () => {
      let user: StacksUser | null = null;

      if (userSession.isSignInPending()) {
        user = await userSession.handlePendingSignIn();
      } else if (userSession.isUserSignedIn()) {
        user = userSession.loadUserData();
      }

      setUser(user);
    };

    signIn();
  }, [userSession]);

  const context: StacksContext =
    user && userSession.isUserSignedIn()
      ? { isConnected: true, user, userSession, network, authenticate, signOut }
      : {
          isConnected: false,
          authenticate,
          user: null,
          userSession: null,
          network,
          signOut,
        };

  return <StacksContext.Provider value={context}>{children}</StacksContext.Provider>;
}

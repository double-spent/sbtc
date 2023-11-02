import type { UserData } from '@stacks/connect';

import type { SbtcNetwork } from './network';

export type SbtcPsbtSignRequest = {
  publicKey: string;
  hex: string;
};

export type SbtcContext = {
  user?: UserData;
  network: SbtcNetwork;
  signPsbt: (request: SbtcPsbtSignRequest) => Promise<string>;
};

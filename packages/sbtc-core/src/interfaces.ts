export type SbtcPsbtSignRequest = {
  publicKey: string;
  hex: string;
};

export type SbtcSignPsbtCallback = (request: SbtcPsbtSignRequest) => Promise<string>;

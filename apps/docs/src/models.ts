export const SbtcTransactionType = ['deposit', 'withdraw'] as const;

export type SbtcTransactionType = (typeof SbtcTransactionType)[number];

import type { UserData } from '@stacks/connect';

export type StacksUser = Omit<UserData, 'profile'> & {
  profile: {
    stxAddress: {
      testnet: string;
      mainnet: string;
    };
  };
};

export type StacksTransactionStatus = 'success' | 'abort_by_response' | 'abort_by_post_condition' | 'pending';

import { Typography } from '@mui/material';

import type { StacksUser } from '../../../shared/stacks';
import { DepositWizard } from '../../DepositWizard';

import type { DepositOrWithdrawTransaction } from './SetupTransaction';

export type SwapAssetsProps = {
  transaction: DepositOrWithdrawTransaction;
  user: StacksUser;
};

export function DepositOrWithdraw({ transaction }: SwapAssetsProps) {
  if (transaction.type === 'deposit') {
    return <DepositWizard amount={transaction.amount} />;
  }

  return <Typography variant="inherit">Withdraw not yet supported.</Typography>;
}

import { useState } from 'react';

import { useStacksSession } from '../../shared/stacks';

import type { DepositOrWithdrawTransaction } from './steps';
import { ConnectWallet, SetupTransaction } from './steps';
import { DepositOrWithdraw } from './steps/DepositOrWithdraw';

export function DepositOrWithdrawWizard() {
  const stacksSession = useStacksSession();
  const [transaction, setTransaction] = useState<DepositOrWithdrawTransaction>();

  if (!stacksSession.isConnected) {
    return <ConnectWallet />;
  }

  const { user } = stacksSession;

  const handleSetupSwapComplete = (transaction: DepositOrWithdrawTransaction) => {
    setTransaction(transaction);
  };

  if (!transaction) {
    return <SetupTransaction onComplete={handleSetupSwapComplete} />;
  }

  return <DepositOrWithdraw transaction={transaction} user={user} />;
}

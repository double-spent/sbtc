import { useEffect, useState } from 'react';

import type { Transaction } from '@stacks/stacks-blockchain-api-types';

import type { StacksTransactionStatus } from '../../shared/stacks';
import { useStacksSession, useStacksTransactionsApi } from '../../shared/stacks';
import { getTransactionExplorerUrl } from '../../shared/stacks/utils';

export function useStacksTransactionStatusState(transactionId: string) {
  const { network } = useStacksSession();
  const transactionsApi = useStacksTransactionsApi();

  const [transactionStatus, setTransactionStatus] = useState<StacksTransactionStatus | null>(null);

  useEffect(() => {
    const skipFetchTransactionStatus =
      transactionStatus === 'abort_by_post_condition' || transactionStatus === 'abort_by_response';

    const fetchTransactionStatus = async () => {
      if (skipFetchTransactionStatus) {
        return;
      }

      const fetchTransactionResult = (await transactionsApi.getTransactionById({
        txId: transactionId,
      })) as Transaction;

      setTransactionStatus(fetchTransactionResult.tx_status);
    };

    if (skipFetchTransactionStatus) {
      return;
    }

    const intervalId = setInterval(fetchTransactionStatus, 5000);

    return () => clearInterval(intervalId);
  }, [transactionId, transactionStatus, transactionsApi]);

  const explorerTransactionUrl = getTransactionExplorerUrl(transactionId, network);

  return {
    transactionStatus,
    explorerTransactionUrl,
  };
}

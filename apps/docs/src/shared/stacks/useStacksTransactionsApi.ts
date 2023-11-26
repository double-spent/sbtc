import { useMemo } from 'react';

import { Configuration, TransactionsApi } from '@stacks/blockchain-api-client';

import { useStacksSession } from './useStacksSession';

export function useStacksTransactionsApi() {
  const userSession = useStacksSession();

  const transactionsApi = useMemo(
    () =>
      new TransactionsApi(
        new Configuration({
          basePath: userSession.network.coreApiUrl,
        }),
      ),
    [userSession.network.coreApiUrl],
  );

  return transactionsApi;
}

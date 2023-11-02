import { useCallback } from 'react';

import { depositSbtc as coreDepositSbtc } from '@double-spent/sbtc-core';

import { useSbtc } from './context';

export function useDepositSbtc() {
  const sbtc = useSbtc();

  const depositSbtc = useCallback(
    (satsAmount: number) => {
      return coreDepositSbtc({
        satsAmount,
        context: sbtc,
      });
    },
    [sbtc],
  );

  return {
    depositSbtc,
  };
}

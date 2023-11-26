import { useEffect, useState } from 'react';

import { convertSatsToBtc } from '@double-spent/sbtc-core';
import { useSubmitSbtcDeposit } from '@double-spent/sbtc-react';
import { Alert, AlertTitle } from '@mui/material';

export type DepositSendStepProps = {
  amount: number;
  onComplete: (btcTransactionHash: string) => void;
  onError?: (error: Error) => void;
};

export function DepositSendStep(props: DepositSendStepProps) {
  const { onComplete, onError } = props;

  const { submitSbtcDeposit } = useSubmitSbtcDeposit();
  const [shouldSendDeposit, setShouldSendDeposit] = useState(true);

  useEffect(() => {
    if (!shouldSendDeposit) {
      return;
    }

    const sendDeposit = async () => {
      setShouldSendDeposit(false);

      try {
        const { btcTransactionHash } = await submitSbtcDeposit(props.amount);
        return onComplete?.(btcTransactionHash);
      } catch (error) {
        onError?.(error as Error);
      }
    };

    sendDeposit();
  }, [onComplete, onError, props.amount, shouldSendDeposit, submitSbtcDeposit]);

  return (
    <Alert severity="warning">
      <AlertTitle>Confirm deposit</AlertTitle>
      Please, confirm with your wallet that you want to deposit {convertSatsToBtc(props.amount)} BTC. Once confirmed,
      the Bitcoin will be sent to the bridge and sBTC will be sent back to your Stacks wallet.
    </Alert>
  );
}

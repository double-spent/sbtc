import Link from 'next/link';

import { Alert, AlertTitle, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';

import { useStacksTransactionStatusState } from './StacksTransactionStatus.state';

export type StacksTransactionStatusProps = {
  transactionId: string;
  onSuccess?: () => void;
  onError?: () => void;
};

export function StacksTransactionStatus({ transactionId, onSuccess, onError }: StacksTransactionStatusProps) {
  const { transactionStatus, explorerTransactionUrl } = useStacksTransactionStatusState(transactionId);

  if (!transactionStatus || transactionStatus === 'pending') {
    return (
      <Box display="flex" justifyContent="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body1">
            Waiting for&nbsp;
            <Link href={explorerTransactionUrl} target="_blank">
              your transaction
            </Link>
            &nbsp;to be confirmed on the Stacks network...
          </Typography>
          <CircularProgress size={20} color="secondary" />
        </Stack>
      </Box>
    );
  }

  switch (transactionStatus) {
    case 'success':
      return (
        <Stack spacing={2}>
          <Alert severity="success">
            <AlertTitle>Transaction succeeded</AlertTitle>
            <Typography variant="inherit">
              <Link href={explorerTransactionUrl} target="_blank">
                Your transaction
              </Link>
              has been successfully confirmed on the Stacks network.
            </Typography>
          </Alert>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={onSuccess}>Continue</Button>
          </Box>
        </Stack>
      );

    default:
      return (
        <Stack spacing={2}>
          <Alert severity="error">
            <AlertTitle>Transaction failed</AlertTitle>
            <Typography variant="inherit">Your transaction has been rejected.</Typography>
          </Alert>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={onError}>OK</Button>
          </Box>
        </Stack>
      );
  }
}

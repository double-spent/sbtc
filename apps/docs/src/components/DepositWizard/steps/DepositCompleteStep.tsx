import { Alert, AlertTitle, Box, Button, Stack } from '@mui/material';

import { useStacksSession } from '../../../shared/stacks';
import { shortenStacksAddress } from '../../../shared/utils';

export type DepositCompleteStepProps = {
  btcTransactionHash: string;
};

export function DepositCompleteStep({ btcTransactionHash }: DepositCompleteStepProps) {
  const session = useStacksSession();

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        <AlertTitle>Deposit sent</AlertTitle>
        Your deposit has been sent! The Bitcoin transaction has been broadcasted to the network and the sBTC should be
        in your wallet {shortenStacksAddress(session.user!.profile.stxAddress.testnet)} shortly.
      </Alert>
      <Box display="flex" justifyContent="end">
        <Stack direction="row" spacing={2}>
          <Button variant="text" href={`https://blockstream.info/testnet/tx/${btcTransactionHash}`} target="_blank">
            View transaction
          </Button>
          <Button variant="contained" color="primary">
            Done
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

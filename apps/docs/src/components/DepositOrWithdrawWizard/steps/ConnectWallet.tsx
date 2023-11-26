import Link from 'next/link';

import { Alert, AlertTitle, Stack, Typography } from '@mui/material';

import { WalletConnectButton } from '../../WalletConnectButton';

export function ConnectWallet() {
  return (
    <Alert severity="info">
      <AlertTitle>Connect wallet</AlertTitle>
      <Stack spacing={2}>
        <Typography variant="inherit">
          To continue, please connect using your preferred wallet provider. If you do not have a wallet provider
          installed in your browser yet, check out either the <Link href="https://leather.io/">Leather</Link> or&nbsp;
          <Link href="https://www.xverse.app/">XVerse</Link> wallets.
        </Typography>
        <Stack direction="row" justifyContent="flex-end">
          <WalletConnectButton />
        </Stack>
      </Stack>
    </Alert>
  );
}

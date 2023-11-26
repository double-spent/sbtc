import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import { WalletConnectButton } from './WalletConnectButton';

export function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          ✨ sBTC
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <WalletConnectButton />
      </Toolbar>
    </AppBar>
  );
}

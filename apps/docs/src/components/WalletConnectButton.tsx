import { useState } from 'react';

import { Button, List, ListItem, ListItemButton, Popover } from '@mui/material';

import { useStacksSession } from '../shared/stacks';

export function WalletConnectButton() {
  const session = useStacksSession();
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const isMenuOpen = !!menuAnchorEl;

  if (!session.isConnected) {
    return (
      <Button variant="contained" color="primary" onClick={session.authenticate}>
        Connect Wallet
      </Button>
    );
  }

  const address = session.user.profile.stxAddress.testnet;

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClick}>
        {address.substring(0, 4)}...{address.substring(address.length - 4)}
      </Button>
      <Popover
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => session.signOut()}>Disconnect</ListItemButton>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

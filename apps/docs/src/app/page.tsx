'use client';

import { Container, CssBaseline } from '@mui/material';

import { DepositOrWithdrawWizard, Header } from '../components';
import { SbtcNextProvider } from '../shared/sbtc';
import { Stacks } from '../shared/stacks';

export default function Page() {
  return (
    <Stacks>
      <SbtcNextProvider>
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" sx={{ position: 'relative', marginTop: 5, minHeight: '80vh' }}>
          <DepositOrWithdrawWizard />
        </Container>
      </SbtcNextProvider>
    </Stacks>
  );
}

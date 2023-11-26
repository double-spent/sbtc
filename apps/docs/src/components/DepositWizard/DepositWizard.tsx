import type { ReactNode } from 'react';
import { useState } from 'react';

import { Box, Paper, Stack, Step, StepLabel, Stepper } from '@mui/material';

import { DepositCompleteStep, DepositSendStep } from './steps';

const DepositWizardStep = ['sending', 'complete'] as const;

type DepositWizardStep = (typeof DepositWizardStep)[number];

export type DepositWizardProps = {
  amount: number;
};

export function DepositWizard({ amount }: DepositWizardProps) {
  const [step, setStep] = useState<DepositWizardStep>('sending');
  const [depositBtcTransactionHash, setDepositBtcTransactionHash] = useState<string | null>(null);

  if (step === 'sending' && !depositBtcTransactionHash) {
    return (
      <DepositWizardContainer step="sending">
        <DepositSendStep
          amount={amount}
          onComplete={(btcTransactionHash) => {
            setDepositBtcTransactionHash(btcTransactionHash);
            setStep('complete');
          }}
        />
      </DepositWizardContainer>
    );
  }

  return (
    <DepositWizardContainer step="complete">
      <DepositCompleteStep btcTransactionHash={depositBtcTransactionHash!} />
    </DepositWizardContainer>
  );
}

type InboundSwapWizardContainerProps = {
  step: DepositWizardStep;
  children: ReactNode;
};

function DepositWizardContainer({ step, children }: InboundSwapWizardContainerProps) {
  const activeStepIndex = DepositWizardStep.indexOf(step);

  return (
    <Paper elevation={2}>
      <Box padding={5}>
        <Stack spacing={5}>
          <Stepper alternativeLabel activeStep={activeStepIndex}>
            <Step>
              <StepLabel>Send</StepLabel>
            </Step>
            <Step>
              <StepLabel>Done</StepLabel>
            </Step>
          </Stepper>
          {children}
        </Stack>
      </Box>
    </Paper>
  );
}

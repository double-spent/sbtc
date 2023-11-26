import type { FormikProps } from 'formik';
import { Form, Formik, useField } from 'formik';
import * as yup from 'yup';

import { convertBtcToSats } from '@double-spent/sbtc-core';
import { SwapVert } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';

import type { SbtcTransactionType } from '../../../models';

export type DepositOrWithdrawTransaction = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  amount: yup.number().moreThan(0).required(),
  type: yup.mixed<SbtcTransactionType>().oneOf(['deposit', 'withdraw']).required(),
});

export type SetupTransactionProps = {
  onComplete?: (transaction: DepositOrWithdrawTransaction) => void;
};

export function SetupTransaction({ onComplete }: SetupTransactionProps) {
  const initialValues: DepositOrWithdrawTransaction = {
    amount: 0,
    type: 'deposit',
  };

  const onSubmit = (values: DepositOrWithdrawTransaction) => {
    onComplete?.({ ...values, amount: convertBtcToSats(values.amount) });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {(formikProps) => <SetupTransactionForm {...formikProps} />}
    </Formik>
  );
}

export function SetupTransactionForm({ values, setFieldValue }: FormikProps<DepositOrWithdrawTransaction>) {
  const { type } = values;

  const [amountField, amountFieldMeta] = useField('amount');

  const amountFieldLabel = type === 'deposit' ? 'BTC' : 'sBTC';
  const amountFieldError = !!(amountFieldMeta && amountFieldMeta.touched && amountFieldMeta.error);

  const handleTypeButtonClick = () => {
    setFieldValue('type', type === 'deposit' ? 'deposit' : 'withdraw');
  };

  return (
    <Form>
      <Stack spacing={2}>
        <TextField
          {...amountField}
          error={amountFieldError}
          InputProps={{
            startAdornment: <InputAdornment position="start">{amountFieldLabel}</InputAdornment>,
            endAdornment: (
              <IconButton onClick={handleTypeButtonClick}>
                <SwapVert />
              </IconButton>
            ),
          }}
        />
        <Button color="primary" variant="contained" type="submit">
          {type === 'deposit' ? 'DEPOSIT' : 'WITHDRAW'}
        </Button>
      </Stack>
    </Form>
  );
}

import { mock, mockDeep } from 'jest-mock-extended';
import type { TestnetHelper } from 'sbtc';
import { sbtcDepositHelper } from 'sbtc';

import type { Transaction as BtcTransaction } from '@scure/btc-signer';
import { hexToBytes } from '@stacks/common';

import { getSbtcApi, SbtcNetwork } from './network';
import { submitSbtcDeposit } from './submitSbtcDeposit';

jest.mock('sbtc');
jest.mock('./network');

describe(submitSbtcDeposit, () => {
  it('submits deposit', async () => {
    const signPsbt = jest.fn();

    const api = mockDeep<TestnetHelper>();
    const psbt = hexToBytes('test-string');

    const transaction = mock<BtcTransaction>({
      toPSBT: jest.fn().mockReturnValue(psbt),
    });

    jest.mocked(getSbtcApi).mockReturnValue(api);
    jest.mocked(sbtcDepositHelper).mockResolvedValue(transaction);

    const result = await submitSbtcDeposit({
      satsAmount: 10_000,
      network: SbtcNetwork.TESTNET,
      stacksAddress: 'ST2ST2H80NP5C9SPR4ENJ1Z9CDM9PKAJVPYWPQZ50',
      bitcoinAddress: 'tb1q3zl64vadtuh3vnsuhdgv6pm93n82ye8qc36c07',
      bitcoinPublicKey: 'aaabbbcccddd',
      signPsbt,
    });
  });
});

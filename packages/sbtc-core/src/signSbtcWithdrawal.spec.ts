import { sbtcWithdrawMessage } from 'sbtc';

import { faker } from '@faker-js/faker';
import { StacksTestnet } from '@stacks/network';

import { SbtcNetwork } from './network';
import { signSbtcWithdrawal } from './signSbtcWithdrawal';

jest.mock('sbtc');

describe(signSbtcWithdrawal, () => {
  it('signs withdrawal', async () => {
    const expectedMessage = faker.string.alphanumeric({ length: 20 });
    const expectedSignature = faker.string.hexadecimal({ length: 20 });

    const signMessage = jest.fn().mockResolvedValue(expectedSignature);

    jest.mocked(sbtcWithdrawMessage).mockReturnValue(expectedMessage);

    const { signature } = await signSbtcWithdrawal({
      satsAmount: 1_000,
      bitcoinAddress: 'tb1q3zl64vadtuh3vnsuhdgv6pm93n82ye8qc36c07',
      network: SbtcNetwork.TESTNET,
      signMessage,
    });

    expect(signMessage).toHaveBeenCalledWith({ message: expectedMessage, stacksNetwork: expect.any(StacksTestnet) });
    expect(signature).toBe(expectedSignature);
  });
});

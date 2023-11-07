<h1 align="center">@double-spent/sbtc-core 🧱</h1>
<p align="center">
  <b>Integrate sBTC deposits and withdrawals with minimal configuration and an intuitive API.</b>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/@double-spent%2Fsbtc-core">
    <img src="https://badge.fury.io/js/@double-spent%2Fsbtc-core.svg" alt="package npm version" height="18" />
  </a>
  <img src="https://img.shields.io/npm/l/%40double-spent%2Fsbtc-core" alt="package license" height="18">
  <img src="https://img.shields.io/npm/dw/%40double-spent%2Fsbtc-core" alt="package weekly downloads" height="18" />
</p>

## What's inside?

This package allows to easily implement sBTC deposits and withdrawals into Node.js apps and services. The provided
functions and helpers provide an interface to the on-chain contracts deployed on mainnet, testnet, and devnet.

## Installation

```bin
npm i @double-spent/sbtc-core
```

## Usage

### Deposit sBTC

Depositing sBTC involves sending BTC over the Bitcoin network to the sBTC bridge and receive sBTC on the Stacks network.
This can be achieved with the `submitSbtcDeposit` function, which creates a Bitcoin
[PSBT (partially-signed Bitcoin transaction)](https://river.com/learn/what-are-partially-signed-bitcoin-transactions-psbts/)
to send the specified amount and broadcasts it to the network.

> `submitSbtcDeposit` is not tied to a particular wallet, so it requires the callback used to sign the PSBT to be passed
> in the arguments. The example below uses the [Leather Wallet.](https://leather.io/)

```ts
import { submitSbtcDeposit, SbtcNetwork } from '@double-spent/sbtc-core';

// Load user data from a connected wallet

const user = userSession.loadUserData();

const stacksAddress = user.profile.stxAddress.testnet;
const bitcoinAddress = user.profile.btcAddress.p2wpkh.testnet;
const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

// Define a callback to sign PSBTs with Leather

const signPsbt = async (request) => {
  return await (window as any).btc.request('signPsbt', request).result.hex;
};

const satsAmount = 5_000;
const network = SbtcNetwork.TESTNET;

// Submit the sBTC deposit

const btcTransactionHash = await submitSbtcDeposit({
  network,
  stacksAddress,
  bitcoinAddress,
  bitcoinPublicKey,
  satsAmount,
  signPsbt,
});

// Print the transaction hash

console.log({ btcTransactionHash });
```

The `submitSbtcDeposit` function takes the following arguments:

| Argument           | Type                                          | Description                                                      |
| ------------------ | --------------------------------------------- | ---------------------------------------------------------------- |
| `satsAmount`       | `number`                                      | The amount in satoshis to deposit.                               |
| `stacksAddress`    | `string`                                      | The sender's Stacks address where the sBTC will be sent.         |
| `bitcoinAddress`   | `string`                                      | The sender's Bitcoin address where the BTC is deposited from.    |
| `bitcoinPublicKey` | `string`                                      | The sender's Bitcoin public key used to sign the deposit PSBT.   |
| `network`          | [`SbtcNetwork`](./src/network.ts)             | The network to use.                                              |
| `feeRateTarget`    | [`SbtcDepositFeeRate`](./src/interfaces.ts)   | The target fee rate to use (low, medium, high).                  |
| `signPsbt`         | [`SbtcSignPsbtCallback`](./src/interfaces.ts) | The callback used to sign PSBTs before broadcasting the deposit. |

### Withdraw sBTC for BTC

Withdrawing BTC for sBTC involves sending sBTC over the Stacks network to the bridge and receiving BTC on the Bitcoin
network. This requires two steps: to sign the withdrawal with a Stacks wallet and submit the withdrawal via a PSBT. The
`signSbtcWithdrawal` and `submitSbtcWithdrawal` function are used to achieve both steps. `submitSbtcWithdrawal` works
similar to `submitSbtcDeposit` but it takes the signature resulting from calling `signSbtcWithdrawal`.

> `signSbtcWithdrawal` and `submitSbtcWithdrawal` are not tied to a particular wallet, so they require callbacks used to
> sign messages and sign the PSBT to be passed in the arguments. The example below uses the
> [Leather Wallet.](https://leather.io/)

#### Sign the withdrawal

```ts
import { openSignatureRequestPopup } from '@stacks/connect';
import { signSbtcWithdrawal, SbtcNetwork } from '@double-spent/sbtc-core';

// Load user data from a connected wallet

const user = userSession.loadUserData();
const bitcoinAddress = user.profile.btcAddress.p2wpkh.testnet;

// Define a callback to sign messages using Leather

const signMessage = async ({ message, stacksNetwork }) => {
  return await new Promise((resolve) => {
    openSignatureRequestPopup({
      message,
      userSession,
      network: stacksNetwork,
      onFinish: (data) => {
        resolve(data.signature);
      },
    });
  });
};

const satsAmount = 5_000;
const network = SbtcNetwork.TESTNET;

// Sign the sBTC withdrawal

const signature = await signSbtcWithdrawal({
  bitcoinAddress,
  satsAmount,
  network,
  signMessage,
});

// Print the transaction hash

console.log({ signature });
```

The `signSbtcWithdrawal` function takes the following arguments:

| Argument         | Type                                                | Description                                                   |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------------- |
| `satsAmount`     | `number`                                            | The amount in satoshis to withdraw.                           |
| `bitcoinAddress` | `string`                                            | The sender's Bitcoin address where the BTC will be withdrawn. |
| `network`        | [`SbtcNetwork`](./src/network.ts)                   | The network to use.                                           |
| `signMessage`    | [`SbtcSignMessageCallback`](./src/interfaces.ts#L6) | The callback used to sign the message.                        |

#### Submit the withdrawal

```ts
import { submitSbtcWithdrawal, SbtcNetwork } from '@double-spent/sbtc-core';

// Load user data from a connected wallet

const user = userSession.loadUserData();

const bitcoinAddress = user.profile.btcAddress.p2wpkh.testnet;
const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

// Define a callback to sign PSBTs using Leather

const signPsbt = async (request) => {
  return await (window as any).btc.request('signPsbt', request).result.hex;
};

const satsAmount = 5_000;
const network = SbtcNetwork.TESTNET;

const signature = await signSbtcWithdrawal({
  // .. sign withdrawal args
});

// Submit the sBTC deposit

const btcTransactionHash = await submitSbtcWithdrawal({
  network,
  bitcoinAddress,
  bitcoinPublicKey,
  satsAmount,
  signature,
  signPsbt,
});

// Print the transaction hash

console.log({ btcTransactionHash });
```

The `signSbtcWithdrawal` function takes the following arguments:

| Argument           | Type                                          | Description                                                         |
| ------------------ | --------------------------------------------- | ------------------------------------------------------------------- |
| `satsAmount`       | `number`                                      | The amount in satoshis to withdraw.                                 |
| `bitcoinAddress`   | `string`                                      | The sender's Bitcoin address where the BTC will be withdrawn to.    |
| `bitcoinPublicKey` | `string`                                      | The sender's Bitcoin public key used to sign the withdrawal PSBT.   |
| `network`          | [`SbtcNetwork`](./src/network.ts)             | The network to use.                                                 |
| `signPsbt`         | [`SbtcSignPsbtCallback`](./src/interfaces.ts) | The callback used to sign PSBTs before broadcasting the withdrawal. |

## Supported features

| Feature       | Mode        | Status       |
| ------------- | ----------- | ------------ |
| sBTC Devnet   |             | ✅ Supported |
| sBTC Testnet  |             | ✅ Supported |
| sBTC Mainnet  |             | 🟡 Pending   |
| Deposit sBTC  | `OP_RETURN` | ✅ Supported |
| Withdraw sBTC | `OP_RETURN` | ✅ Supported |
| Deposit sBTC  | `OP_DROP`   | 🟡 Pending   |
| Withdraw sBTC | `OP_DROP`   | 🟡 Pending   |

## References

- [sBTC official documentation](https://stacks-network.github.io/sbtc-docs/) by Stacks
- [sbtc NPM package](https://www.npmjs.com/package/sbtc) by Stacks

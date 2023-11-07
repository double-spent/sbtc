<h1 align="center">@double-spent/sbtc-core 🧱</h1>

<p align="center">
  <b>Deposit and withdraw sBTC with minimal configuration and an intuitive API.</b>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/@double-spent%2Fsbtc-core">
    <img src="https://badge.fury.io/js/@double-spent%2Fsbtc-core.svg" alt="package npm version" height="18" />
  </a>
  <img src="https://img.shields.io/npm/l/%40double-spent%2Fsbtc-core" alt="package license" height="18">
  <img src="https://img.shields.io/npm/dw/%40double-spent%2Fsbtc-core" alt="package weekly downloads" height="18" />
</p>

## What's inside?

This library provides functions and utilities to deposit and withdraw sBTC using deployed mainnet, testnet, and devnet
contracts.

## Usage

### Deposit BTC for sBTC

Depositing sBTC is done via the `submitSbtcDeposit` function which creates a Bitcoin
[PSBT](https://river.com/learn/what-are-partially-signed-bitcoin-transactions-psbts/) transaction to send an amount of
BTC over the Bitcoin network and receive sBTC on the Stacks network. Set up the sender addresses, network, and the
callback to sign the deposit PSBT before broadcasting to the network.

```ts
import { submitSbtcDeposit, SbtcNetwork } from '@double-spent/sbtc-core';

// Load user data from a connected wallet
const user = userSession.loadUserData();

const stacksAddress = user.profile.stxAddress.testnet;
const bitcoinAddress = user.profile.btcAddress.p2wpkh.testnet;
const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

// Define a callback to sign PSBTs

const signPsbt = async (request) => {
  return await (window as any).btc.request('signPsbt', request).result.hex;
};

const satsAmount = 5_000;
const network = SbtcNetwork.TESTNET;

// Send the deposit

const btcTransactionHash = await submitSbtcDeposit({
  network,
  stacksAddress,
  bitcoinAddress,
  bitcoinPublicKey,
  satsAmount,
  signPsbt,
});

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
| `signPsbt`         | [`SbtcSignPsbtCallback`](./src/interfaces.ts) | The callback used to sign PSBTs before broadcasting the deposit. |

### Withdraw sBTC for BTC

Withdrawing BTC for sBTC takes two steps: signing the withdrawal and submitting the withdrawal transaction.

#### Sign the withdrawal

Sign the withdrawal request with the Stacks wallet via the `signSbtcWithdrawal` to create a proof of ownership of the
sBTC.

```ts
import { signSbtcWithdrawal, SbtcNetwork } from '@double-spent/sbtc-core';
import { openSignatureRequestPopup } from '@stacks/connect';

// Load user data from a connected wallet
const user = userSession.loadUserData();
const bitcoinAddress = user.profile.btcAddress.p2wpkh.testnet;

// Define a callback to sign the message using a Stacks wallet

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

// Sign the withdrawal

const signature = await signSbtcWithdrawal({
  bitcoinAddress,
  satsAmount,
  network,
  signMessage,
});

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

Submit the withdrawal request by calling `submitSbtcWithdrawal`.

```ts
import { submitSbtcWithdrawal, SbtcNetwork } from '@double-spent/sbtc-core';

// Load user data from a connected wallet
const user = userSession.loadUserData();

const bitcoinAddress = user.profile.btcAddress.p2wpkh.testnet;
const bitcoinPublicKey = user.profile.btcPublicKey.p2wpkh;

// Define a callback to sign PSBTs

const signPsbt = async (request) => {
  return await (window as any).btc.request('signPsbt', request).result.hex;
};

const satsAmount = 5_000;
const network = SbtcNetwork.TESTNET;

const signature = await signSbtcWithdrawal({
  // .. sign withdrawal args
});

// Send the deposit

const btcTransactionHash = await submitSbtcWithdrawal({
  network,
  bitcoinAddress,
  bitcoinPublicKey,
  satsAmount,
  signature,
  signPsbt,
});

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

<h1 align="center">@double-spent/sbtc-core 🧱</h1>

<p align="center">
  <b>Deposit and withdraw sBTC with minimal configuration and an intuitive API.</b>
</p>

## What's inside?

This library provides functions and utilities to deposit, withdraw, and track sBTC using deployed mainnet, testnet, and
devnet local contracts.

## Usage

### Deposit sBTC

Depositing sBTC is done via the `depositSbtc` function. Set up the sender addresses, network, and the callback to sign
the deposit [PSBT](https://river.com/learn/what-are-partially-signed-bitcoin-transactions-psbts/) before broadcasting to
the network.

```ts
import { depositSbtc, SbtcNetwork } from '@double-spent/sbtc-core';

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

const btcTransactionHash = await depositSbtc({
  network,
  stacksAddress,
  bitcoinAddress,
  bitcoinPublicKey,
  satsAmount,
  signPsbt,
});

console.log({ btcTransactionHash });
```

The `depositSbtc` function takes the following arguments:

| Argument           | Type                                             | Description                                                      |
| ------------------ | ------------------------------------------------ | ---------------------------------------------------------------- |
| `satsAmount`       | `number`                                         | The amount in satoshis to deposit.                               |
| `stacksAddress`    | `string`                                         | The sender's Stacks address where the sBTC will be sent.         |
| `bitcoinAddress`   | `string`                                         | The sender's Bitcoin address where the BTC is deposited from.    |
| `bitcoinPublicKey` | `string`                                         | The sender's Bitcoin public key used to sign the deposit PSBT.   |
| `network`          | [`SbtcNetwork`](./src/network.ts#L5)             | The network to use.                                              |
| `signPsbt`         | [`SbtcSignPsbtCallback`](./src/interfaces.ts#L6) | The callback used to sign PSBTs before broadcasting the deposit. |

## Supported features

| Feature       | Mode        | Status       |
| ------------- | ----------- | ------------ |
| sBTC Devnet   |             | 🟡 Pending   |
| sBTC Testnet  |             | ✅ Supported |
| sBTC Mainnet  |             | 🟡 Pending   |
| Deposit sBTC  | `OP_RETURN` | ✅ Supported |
| Withdraw sBTC | `OP_RETURN` | 🟡 Pending   |
| Deposit sBTC  | `OP_DROP`   | 🟡 Pending   |
| Withdraw sBTC | `OP_DROP`   | 🟡 Pending   |

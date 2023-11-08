<h1 align="center">@double-spent/sbtc-react ⚛️</h1>

<p align="center">
  <b>Integrate sBTC deposits and withdrawals in React apps with minimal configuration and an intuitive API.</b>
</p>

<p align="center">
  <a href="https://badge.fury.io/js/@double-spent%2Fsbtc-react">
    <img src="https://badge.fury.io/js/@double-spent%2Fsbtc-react.svg" alt="package npm version" height="18" />
  </a>
  <img src="https://img.shields.io/npm/l/%40double-spent%2Fsbtc-react" alt="package license" height="18">
  <img src="https://img.shields.io/npm/dw/%40double-spent%2Fsbtc-react" alt="package weekly downloads" height="18" />
</p>

## What's inside?

This package allows to easily implement sBTC deposits and withdrawals into React apps. The provided functions and
helpers provide an interface to the on-chain contracts deployed on mainnet, testnet, and devnet.

## Usage

## Installation

```bin
npm i @double-spent/sbtc-react
```

### Set up providers

The [`SbtcProvider`](./src/context.tsx) component provides context to the hooks included in this package. Add an
instance of `SbtcProvider` at the top of the component tree — this would be `App.tsx` in `create-react-app` or the
[Root Layout](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required) in
Next.js.

> This package is not tied to a particular wallet, so the `SbtcProvider` requires the callbacks used to sign messages
> and PSBTs to be passed as props. The example below uses the [Leather Wallet.](https://leather.io/)

```ts
// App.tsx

export default function App() {
  // Load user data from a connected wallet

  const user = userSession.loadUserData();

  // Define a callback used to sign PSBTs with Leather

  const signPsbt = async (request) => {
    return await (window as any).btc.request('signPsbt', request).result.hex;
  };

  // Define a callback used to sign messages with Leather

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

  return (
    <>
      <SbtcProvider user={user} network={SbtcNetwork.TESTNET} signMessage={signMessage} signPsbt={signPsbt}>
        {/* rest of app goes here .. */}
      </SbtcProvider>
    </>
  );
}
```

The `SbtcProvider` component takes the following props:

| Prop          | Type                                                        | Description                          |
| ------------- | ----------------------------------------------------------- | ------------------------------------ |
| `user`        | `UserData?`                                                 | The connected wallet's user, if any. |
| `network`     | [`SbtcNetwork`](../sbtc-core/src/network.ts)                | The network to use.                  |
| `signPsbt`    | [`SbtcSignPsbtCallback`](../sbtc-core/src/interfaces.ts)    | The callback used to sign PSBTs.     |
| `signMessage` | [`SbtcSignMessageCallback`](../sbtc-core/src/interfaces.ts) | The callback used to sign messages.  |

### Submit an sBTC deposit

The `useSubmitSbtcDeposit` hook returns a callback used to submit sBTC deposits. It requires an instance of
`SbtcProvider` present in the component tree to retrieve common configuration, like the connected Stacks user session.
As the example above, triggering a deposit will open Leather to request signing the
[PSBT (partially-signed Bitcoin transaction)](https://river.com/learn/what-are-partially-signed-bitcoin-transactions-psbts/)
to send the BTC to the bridge and receive sBTC.

> See the [`@double-spent/sbtc-core`](../sbtc-core/README.md#deposit-btc-for-sbtc) for more details.

```ts
// Deposit.tsx

export function Deposit() {
  const [satsAmount, setSatsAmount] = useState(0);
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const { submitSbtcDeposit } = useSubmitSbtcDeposit();

  const handleChange = (event) => {
    setSatsAmount(parseInt(event.target.value));
  };

  const handleSubmit = async () => {
    const { btcTransactionHash } = await submitSbtcDeposit(satsAmount);
    setTransactionHash(btcTransactionHash);
  };

  if (transactionHash) {
    return (
      <div>
        <h4>Deposit submitted!</h4>
        <p>
          Transaction hash:
          <a href={`https://blockstream.info/testnet/tx/${transactionHash}`} target="_blank">
            {transactionHash}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4>Deposit sBTC</h4>
      <input name="amount" onChange={handleChange} />
      <button onClick={handleSubmit}>Deposit</button>
    </div>
  );
}
```

### Sign and submit an sBTC withdrawal

The `useSignSbtcWithdrawal` and `useSubmitSbtcWithdrawal` hooks return callbacks to sign and submit sBTC withdrawals
respectively. They require an instance of `SbtcProvider` present in the component tree to retrieve common configuration,
like the connected Stacks user session. As the example above, calling either hook will open Leather to request signing
the withdrawal and the
[PSBT (partially-signed Bitcoin transaction)](https://river.com/learn/what-are-partially-signed-bitcoin-transactions-psbts/)
to send the sBTC to the bridge and receive BTC.

> See the [`@double-spent/sbtc-core`](../sbtc-core/README.md#withdraw-sbtc-for-btc) for more details.

```ts
// Withdraw.tsx

export function Withdraw() {
  const [satsAmount, setSatsAmount] = useState(0);
  const [transactionHash, setTransactoinHash] = useState<string | undefined>();

  const { signSbtcWithdrawal } = useSignSbtcWithdrawal();
  const { submitSbtcDeposit } = useSubmitSbtcWithdrawal();

  const handleChange = (event) => {
    setSatsAmount(parseInt(event.target.value));
  };

  const handleSubmit = async () => {
    const signature = await signSbtcWithdrawal(satsAmount);
    const transactionHash = await submitSbtcWithdrawal(satsAmount, signature);

    setTransactionHash(transactionHash);
  };

  if (transactinHash) {
    return (
      <div>
        <h4>Withdrawal submitted!</h4>
        <p>
          Transaction hash:
          <a href={`https://blockstream.info/testnet/tx/${transactionHash}`} target="_blank">
            {transactionHash}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h4>Withdraw sBTC</h4>
      <input name="amount" onChange={handleChange} />
      <button onClick={handleSubmit}>Deposit</button>
    </div>
  );
}
```

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

- [sBTC Bridge](https://bridge.sbtc.tech/)
- [sBTC Official Documentation](https://stacks-network.github.io/sbtc-docs/)
- [`sbtc` NPM Package](https://www.npmjs.com/package/sbtc)

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

This library provides React hooks and components to deposit and withdraw sBTC using deployed mainnet, testnet, and
devnet contracts.

## Usage

### Set-up provider

Add an instance of `SbtcProvider` at the top of the component tree.

```ts
// App.tsx

export default function App() {
  // Load user data from a connected wallet
  const user = userSession.loadUserData();

  // Define the callback used to sign PSBTs
  const signPsbt = async (request) => {
    return await (window as any).btc.request('signPsbt', request).result.hex;
  };

  // Define the callback used to sign messages
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
        <div>
          <p>App goes here...</p>
        </div>
      </SbtcProvider>
    </>
  );
}
```

`SbtcProvider` takes the following props:

| Prop          | Type                      | Description                          |
| ------------- | ------------------------- | ------------------------------------ |
| `user`        | `UserData?`               | The connected wallet's user, if any. |
| `network`     | `SbtcNetwork`             | The network to use.                  |
| `signPsbt`    | `SbtcSignPsbtCallback`    | The callback used to sign PSBTs.     |
| `signMessage` | `SbtcSignMessageCallback` | The callback used to sign messages.  |

### Submit an sBTC deposit

To submit an sBTC deposit, use the `useSubmitSbtcDeposit` hook. The callback returned is intended to be used in event
handlers or other async functions. When calling `submitSbtcDeposit` with the amount to deposit, a request will be
triggered to sign a PSBT used to send the BTC and receive sBTC on the associated Stacks wallet address.

```ts
// Deposit.tsx

export function Deposit() {
  const [satsAmount, setSatsAmount] = useState(0);
  const [transactionHash, setTransactoinHash] = useState<string | undefined>();
  const { submitSbtcDeposit } = useSubmitSbtcDeposit();

  const handleChange = (event) => {
    setSatsAmount(parseInt(event.target.value));
  };

  const handleSubmit = async () => {
    const submitSbtcDeposit(satsAmount);
  };

  if (transactinHash) {
    return (
      <div>
        <p>Submitted deposit: {transactionHash}</p>
      </div>
    );
  }

  return (
    <div>
      <input name="amount" onChange={handleChange} />
      <button onClick={handleSubmit}>Deposit</button>
    </div>
  );
}
```

### Sign and submit an sBTC withdrawal

To sign and submit an sBTC withdrawal, use the `useSignSbtcWithdrawal` and `useSubmitSbtcWithdrawal` hooks. A withdrawal
requires to first sign the transaction and then submit it with the signature.

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
        <p>Submitted withdrawal: {transactionHash}</p>
      </div>
    );
  }

  return (
    <div>
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

- [sBTC official documentation](https://stacks-network.github.io/sbtc-docs/) by Stacks
- [sbtc NPM package](https://www.npmjs.com/package/sbtc) by Stacks

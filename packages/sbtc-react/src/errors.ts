import { SBtcProvider } from './context';

export class SbtcContextMissingError extends Error {
  constructor() {
    super(
      `No instance of ${SBtcProvider.name} provider has been found. ` +
        `Please, add the <${SBtcProvider.name} /> component higher in the component tree.`,
    );
  }
}

export class SbtcUserNotFoundError extends Error {
  constructor() {
    super(`No use data was provided. No wallet has been connected or the current user is invalid.`);
  }
}

export class SbtcSubmitDepositError extends Error {
  constructor(public readonly innerError: Error) {
    super(`Submitting sBTC deposit failed with message: ${innerError.message}`);
  }
}

export class SbtcSignWithdrawalError extends Error {
  constructor(public readonly innerError: Error) {
    super(`Signing sBTC withdrawal failed with message: ${innerError.message}`);
  }
}

export class SbtcSubmitWithdrawalError extends Error {
  constructor(public readonly innerError: Error) {
    super(`Submitting sBTC withdrawal failed with message: ${innerError.message}`);
  }
}

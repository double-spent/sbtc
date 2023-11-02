import { SBtcProvider } from './context';

export class SbtcContextMissingError extends Error {
  constructor() {
    super(
      `No instance of ${SBtcProvider.name} provider has been found. ` +
        `Please, add the <${SBtcProvider.name} /> component higher in the component tree.`,
    );
  }
}

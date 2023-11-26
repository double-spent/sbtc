import { useContext } from 'react';

import { StacksContext } from './Stacks';

export function useStacksSession() {
  const context = useContext(StacksContext);

  if (!context) {
    throw new Error('No context was found in the component tree.');
  }

  return context;
}

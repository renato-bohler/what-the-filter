import { MUTATING_METHODS } from './const';
import { Step } from './types';

export const getWarnings = (step: Step): string[] => {
  const warnings = [];
  const method = step.method;

  if (MUTATING_METHODS.includes(method)) {
    warnings.push(
      `Method \`${method}\` will mutate its input. Mutations are often problematic and can lead to confusion.`,
    );
  }

  if (method === 'sort' && step.arguments.length === 0) {
    warnings.push(
      'When no comparison function is not supplied, the array will be sorted by converting every non-undefined element to string and then comparing them. This will be a problem if you are trying to sort an array of numbers, for example.',
    );
  }

  return warnings;
};

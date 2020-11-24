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

  return warnings;
};

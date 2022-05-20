import { ARGUMENT_EXAMPLES } from './const';
import { Step, ResultErrorHint } from './types';

export const getErrorHint = (
  error: Error,
  lastStep: Step,
): ResultErrorHint | null => {
  if (!lastStep) return null;

  const lastMethod = lastStep.method;
  const lastInput = lastStep.input;
  let lastInputType: string = typeof lastInput;
  if (Array.isArray(lastInputType)) {
    lastInputType = 'array';
  }
  let lastInputText = JSON.stringify(lastInput);
  if (lastInputType === 'object') {
    lastInputText = `${lastInputText
      .replace(/"([^"]+)":/g, '$1: ')
      .replace(/,/g, ', ')}`;
  }

  if (/^undefined is not a function$/.test(error.message)) {
    if (
      [
        'filter',
        'map',
        'reduce',
        'find',
        'findIndex',
        'every',
        'some',
      ].includes(lastMethod)
    ) {
      return {
        message: `You probably forgot to add the callback as an argument to \`${lastMethod}.\``,
        examples: [
          {
            bad: `input.${lastMethod}()`,
            good: `input.${lastMethod}(${ARGUMENT_EXAMPLES[lastMethod]})`,
          },
        ],
      };
    }
  }

  if (
    /^flatMap mapper function is not callable$/.test(error.message)
  ) {
    return {
      message: `You probably forgot to add the callback as an argument to \`flatMap\`.`,
      examples: [
        {
          bad: `input.flatMap()`,
          good: `input.flatMap(${ARGUMENT_EXAMPLES.flatMap})`,
        },
      ],
    };
  }

  if (
    new RegExp(`${lastMethod} is not a function`).test(error.message)
  ) {
    return {
      message: `You are trying to call \`${lastMethod}\` on \`${lastInputText}\`, but \`${lastInputType}.${lastMethod}\` function does not exist.`,
      examples: ARGUMENT_EXAMPLES[lastMethod]
        ? [
            {
              bad: `(${lastInputText}).${lastMethod}(${ARGUMENT_EXAMPLES[lastMethod]})`,
              good: `([1, 2, 3]).${lastMethod}(${ARGUMENT_EXAMPLES[lastMethod]})`,
            },
          ]
        : [],
    };
  }

  if (
    new RegExp(`Cannot read propert(y|ies).* '${lastMethod}'`).test(
      error.message,
    )
  ) {
    return {
      message: `You are trying to call \`${lastMethod}\` on \`${lastInput}\`, but \`${lastInput}.${lastMethod}\` function does not exist.`,
      examples: [
        {
          bad: `(${lastInput}).${lastMethod}(${ARGUMENT_EXAMPLES[lastMethod]})`,
          good: `([1, 2, 3]).${lastMethod}(${ARGUMENT_EXAMPLES[lastMethod]})`,
        },
      ],
    };
  }

  if (
    /^Reduce of empty array with no initial value$/.test(
      error.message,
    )
  ) {
    return {
      message:
        'When calling `reduce` on an empty array, you need to specify the initial value, which is the second argument given to `reduce`.',
      examples: [
        {
          bad: '([]).reduce((acc, cur) => acc + cur)',
          good: '([]).reduce((acc, cur) => acc + cur, 0)',
        },
      ],
    };
  }

  if (
    /^Iterator value .* is not an entry object$/.test(error.message)
  ) {
    return {
      message:
        'Argument given to `fromEntries` should have entry object format.',
      examples: [
        {
          bad: `Object.fromEntries(${lastInputText})`,
          good: "Object.fromEntries([['a', 1], ['b', 2], ['c', 3]])",
        },
      ],
    };
  }

  if (
    /^Cannot convert undefined or null to object$/.test(
      error.message,
    ) ||
    /is not iterable/.test(error.message)
  ) {
    return {
      message: `Bad argument given to \`${lastMethod}\`.`,
      examples: [
        {
          bad: `Object.${lastMethod}(${lastInput})`,
          good: `Object.${lastMethod}(${ARGUMENT_EXAMPLES[lastMethod]})`,
        },
      ],
    };
  }

  return null;
};

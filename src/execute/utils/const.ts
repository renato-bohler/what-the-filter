import { Method } from './types';

export const MAIN_FUNCTION_NAME = 'whatTheFilter';

export const EXECUTION_STEP_VARIABLE_NAME = 'executionStep';
export const EXECUTION_STEPS_VARIABLE_NAME = 'executionSteps';

export const ARGUMENT_EXAMPLES: Record<Method, string> = {
  'Object.entries': '{a: 1, b: 2, c: 3}',
  'Object.fromEntries': "[['a', 1], ['b', 2], ['c', 3]]",
  'Object.values': '{a: 1, b: 2, c: 3}',
  'Object.keys': '{a: 1, b: 2, c: 3}',
  filter: 'a => a % 2 === 0',
  map: 'a => a + 1',
  reduce: '(acc, cur) => acc + cur, 0',
  flatMap: 'a => a + 1',
  find: 'a => a === 1',
  findIndex: 'a => a === 1',
  every: 'a => a > 0',
  some: 'a => a > 0',
  sort: '',
  reverse: '',
  splice: '',
  copyWithin: '',
  fill: '',
  pop: '',
  shift: '',
  push: '',
  unshift: '',
};

export const MUTATING_METHODS = [
  'sort',
  'reverse',
  'splice',
  'copyWithin',
  'fill',
  'pop',
  'shift',
  'push',
  'unshift',
];

export const INVALID_CODE_ERRORS = {
  GENERIC:
    'Invalid code format. Please refer to the "Tutorial" example',
  ONE_STATEMENT: 'There should be only one statement on the code',
  VARIABLE_DECLARATION:
    'The first statement shoud be a variable declaration',
  NAME: `The main function name should be "${MAIN_FUNCTION_NAME}"`,
  ASYNC: 'The main function should not be async',
  ARROW: 'The main function should be an arrow function',
  RETURN:
    'The main function should contain a return statement as its last statement',
  RETURN_TYPE: 'The main function should return a call expression',
  BLOCK:
    'The main function should have a body block (no concise return)',
};

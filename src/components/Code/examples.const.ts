import { OptionTypeBase, GroupType } from 'react-select';

import { MAIN_FUNCTION_NAME } from 'src/execute/utils/const';

export interface Example extends OptionTypeBase {
  value: string;
  label: string;
}

export type ExampleGroup = GroupType<Example>;

const wrap = (label: string, source: string[]): Example => ({
  label,
  value: [
    `/* ${label} */`,
    `const ${MAIN_FUNCTION_NAME} = () => {`,
    ...source.map((line) => `  ${line}`),
    '}',
  ].join('\n'),
});

export const EXAMPLES: ExampleGroup[] = [
  {
    label: 'Basic examples',
    options: [
      {
        label: 'Tutorial',
        value: [
          '/**',
          ' * Welcome to "what the filter?"!',
          ' * This is a tool that takes array & object transformation code and generates',
          ' * diagrams containing intermediate values and even errors and warnings',
          " * that'll help you find out what the code does (or doesn't).",
          ' *',
          ' * The code needs to have a function declared like the following:',
          ' */',
          `const ${MAIN_FUNCTION_NAME} = () => {`,
          '  // You can do anything you want inside the function body',
          '  const input = [1, 2, 3];',
          '  // Whatever you return in this function will be analyzed to generate the diagram',
          '  return input.map(n => n + 1).filter(n => n % 2 === 0).reduce((acc, cur) => acc + cur);',
          '}',
        ].join('\n'),
      },
      wrap('Error case', [
        'const input = [1, 2, 3];',
        '',
        '/**',
        ' * Filter is being called on an object: this will error out.',
        ' * The error message will be shown on the last diagram step',
        ' * along with some hints on what possibly went wrong.',
        ' */',
        'return input',
        '  .reduce((acc, cur) => ({...acc, [`${cur}`]: cur ** 2}), {})',
        '  .filter(item => item)',
        '  .map(item => item); // this will not show on the diagram',
      ]),
    ],
  },
  {
    label: 'Array',
    options: [
      wrap('Removing odd numbers', [
        'const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];',
        '',
        'return input.filter(n => n % 2 === 0);',
      ]),
      wrap('Adding all numbers in array', [
        'const input = [10, 100, 1000];',
        '',
        'return input.reduce((acc, cur) => acc + cur, 0);',
      ]),
      wrap('Sorting numbers', [
        'const input = [5, 10, 7, 9, 1];',
        '',
        'return input.sort((a, b) => a - b);',
      ]),
      wrap('Removing duplicates', [
        'const input = [1, 2, 3, 3, 2, 1];',
        '',
        '// You can also do [...new Set(input)]',
        "// But we currently don't support this syntax =P",
        'return input.filter((item, index, array) => array.indexOf(item) === index);',
      ]),
      wrap('Removing falsy values', [
        "const input = [0, 1, true, false, '', 'string', {}, [], null, undefined, NaN];",
        '',
        'return input.filter(Boolean);',
      ]),
      wrap('Splitting array into chunks', [
        'const MAX_CHUNK_SIZE = 3;',
        'const input = [...Array(10).keys()];',
        '',
        'return input.reduce((acc, cur, index) => {',
        '  const chunkIndex = Math.floor(index / MAX_CHUNK_SIZE);',
        '  if (!acc[chunkIndex]) acc[chunkIndex] = [];',
        '  acc[chunkIndex].push(cur);',
        '  return acc;',
        '}, []);',
      ]),
    ],
  },
  {
    label: 'Object',
    options: [
      wrap('Removing keys from object', [
        "const KEYS_TO_REMOVE = ['a', 'c'];",
        'const object = { a: 1, b: 2, c: 3 };',
        '',
        'return Object.fromEntries(',
        '  Object.entries(object)',
        '    .filter(([key]) => !KEYS_TO_REMOVE.includes(key))',
        ');',
      ]),
    ],
  },
  {
    label: 'String',
    options: [
      wrap('Concatenating user names into string', [
        'const users = [',
        "  { id: 1, name: 'Alice' },",
        "  { id: 2, name: 'Bob' },",
        "  { id: 3, name: 'Charlie' },",
        '];',
        '',
        "return users.map(item => item.name).join(', ');",
      ]),
    ],
  },
];

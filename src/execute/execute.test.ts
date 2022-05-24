import { execute } from './execute';
import {
  INVALID_CODE_ERRORS,
  MAIN_FUNCTION_NAME,
} from './utils/const';

const wrap = (source: string[]) =>
  [
    `const ${MAIN_FUNCTION_NAME} = () => {`,
    ...source.map((line) => `  ${line}`),
    '}',
  ].join('\n');

describe('Object', () => {
  test('entries', async () => {
    const source = wrap([
      'const input = { a: 1, b: 2, c: 3, d: 4 };',
      'return Object.entries(input);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'Object.entries',
      arguments: ['input'],
      input: { a: 1, b: 2, c: 3, d: 4 },
      output: [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ],
    });
  });

  test('fromEntries', async () => {
    const source = wrap([
      "const input = [['a', 1], ['b', 2], ['c', 3], ['d', 4]];",
      'return Object.fromEntries(input);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'Object.fromEntries',
      arguments: ['input'],
      input: [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ],
      output: { a: 1, b: 2, c: 3, d: 4 },
    });
  });

  test('values', async () => {
    const source = wrap([
      'const input = { a: 1, b: 2, c: 3, d: 4 };',
      'return Object.values(input);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'Object.values',
      arguments: ['input'],
      input: { a: 1, b: 2, c: 3, d: 4 },
      output: [1, 2, 3, 4],
    });
  });

  test('keys', async () => {
    const source = wrap([
      'const input = { a: 1, b: 2, c: 3, d: 4 };',
      'return Object.keys(input);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'Object.keys',
      arguments: ['input'],
      input: { a: 1, b: 2, c: 3, d: 4 },
      output: ['a', 'b', 'c', 'd'],
    });
  });
});

describe('Array', () => {
  test('flat', async () => {
    const source = wrap([
      'const input = [[1, [2]], 3, [4, [5, [6, 7]]], 8];',
      'return input.flat().flat().flat();',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({
      method: 'flat',
      arguments: [],
      input: [[1, [2]], 3, [4, [5, [6, 7]]], 8],
      output: [1, [2], 3, 4, [5, [6, 7]], 8],
    });
    expect(steps[1]).toMatchObject({
      method: 'flat',
      arguments: [],
      input: [1, [2], 3, 4, [5, [6, 7]], 8],
      output: [1, 2, 3, 4, 5, [6, 7], 8],
    });
    expect(steps[2]).toMatchObject({
      method: 'flat',
      arguments: [],
      input: [1, 2, 3, 4, 5, [6, 7], 8],
      output: [1, 2, 3, 4, 5, 6, 7, 8],
    });
  });

  test('flatMap', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4];',
      'return input.flatMap(x => [x, x * 2]);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'flatMap',
      arguments: ['x => [x, x * 2]'],
      input: [1, 2, 3, 4],
      output: [1, 2, 2, 4, 3, 6, 4, 8],
    });
  });

  test('concat', async () => {
    const source = wrap([
      'const input = [];',
      'return input.concat(1).concat([2, 3]).concat([4, 5],[6, 7])',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({
      method: 'concat',
      arguments: ['1'],
      input: [],
      output: [1],
    });
    expect(steps[1]).toMatchObject({
      method: 'concat',
      arguments: ['[2, 3]'],
      input: [1],
      output: [1, 2, 3],
    });
    expect(steps[2]).toMatchObject({
      method: 'concat',
      arguments: ['[4, 5]', '[6, 7]'],
      input: [1, 2, 3],
      output: [1, 2, 3, 4, 5, 6, 7],
    });
  });

  test('find', async () => {
    const source = wrap([
      'const input = [',
      "  { id: 1, name: 'Renato' },",
      "  { id: 2, name: 'Böhler' },",
      '];',
      "return input.find(item => item.name === 'Renato')",
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'find',
      arguments: ['item => item.name === "Renato"'],
      input: [
        { id: 1, name: 'Renato' },
        { id: 2, name: 'Böhler' },
      ],
      output: { id: 1, name: 'Renato' },
    });
  });

  test('findIndex', async () => {
    const source = wrap([
      'const input = [',
      "  { id: 1, name: 'Renato' },",
      "  { id: 2, name: 'Böhler' },",
      '];',
      "return input.findIndex(item => item.name === 'Böhler')",
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'findIndex',
      arguments: ['item => item.name === "Böhler"'],
      input: [
        { id: 1, name: 'Renato' },
        { id: 2, name: 'Böhler' },
      ],
      output: 1,
    });
  });

  test('indexOf', async () => {
    const source = wrap([
      'const input = [10, 20, 30, 40, 50, 50];',
      'return input.indexOf(50, 2);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'indexOf',
      arguments: ['50', '2'],
      input: [10, 20, 30, 40, 50, 50],
      output: 4,
    });
  });

  test('lastIndexOf', async () => {
    const source = wrap([
      'const input = [50, 50, 50, 50, 50];',
      'return input.lastIndexOf(50, 2);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'lastIndexOf',
      arguments: ['50', '2'],
      input: [50, 50, 50, 50, 50],
      output: 2,
    });
  });

  test('every', async () => {
    const source = wrap([
      'const input = [50, 50, 50, 50, 50];',
      'return input.every(n => n === 50);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'every',
      arguments: ['n => n === 50'],
      input: [50, 50, 50, 50, 50],
      output: true,
    });
  });

  test('some', async () => {
    const source = wrap([
      'const input = [10, 20, 30, 40, 50];',
      'return input.some(n => n < 10);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'some',
      arguments: ['n => n < 10'],
      input: [10, 20, 30, 40, 50],
      output: false,
    });
  });

  test('join', async () => {
    const source = wrap([
      'const input = [10, 20, 30, 40, 50];',
      "return input.join(', ')",
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'join',
      arguments: ['", "'],
      input: [10, 20, 30, 40, 50],
      output: '10, 20, 30, 40, 50',
    });
  });

  test('includes', async () => {
    const source = wrap([
      'const input = [10, 20, 30, 40, 50];',
      'return input.includes(30);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'includes',
      arguments: ['30'],
      input: [10, 20, 30, 40, 50],
      output: true,
    });
  });
});

describe('Array execution steps', () => {
  test('filter', async () => {
    const source = wrap([
      'const input = [...Array(10).keys()];',
      'return input.filter(n => n % 2 === 1);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['n => n % 2 === 1'],
      input: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      output: [1, 3, 5, 7, 9],
      executionSteps: [
        {
          input: 0,
          index: 0,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: false,
        },
        {
          input: 1,
          index: 1,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: true,
        },
        {
          input: 2,
          index: 2,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: false,
        },
        {
          input: 3,
          index: 3,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: true,
        },
        {
          input: 4,
          index: 4,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: false,
        },
        {
          input: 5,
          index: 5,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: true,
        },
        {
          input: 6,
          index: 6,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: false,
        },
        {
          input: 7,
          index: 7,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: true,
        },
        {
          input: 8,
          index: 8,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: false,
        },
        {
          input: 9,
          index: 9,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: true,
        },
      ],
    });
  });

  test('filter (by index)', async () => {
    const source = wrap([
      'const input = Array(5).fill(1);',
      'return input.filter((_, index) => index % 2 === 0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['(_, index) => index % 2 === 0'],
      input: [1, 1, 1, 1, 1],
      output: [1, 1, 1],
      executionSteps: [
        {
          input: 1,
          index: 0,
          array: [1, 1, 1, 1, 1],
          output: true,
        },
        {
          input: 1,
          index: 1,
          array: [1, 1, 1, 1, 1],
          output: false,
        },
        {
          input: 1,
          index: 2,
          array: [1, 1, 1, 1, 1],
          output: true,
        },
        {
          input: 1,
          index: 3,
          array: [1, 1, 1, 1, 1],
          output: false,
        },
        {
          input: 1,
          index: 4,
          array: [1, 1, 1, 1, 1],
          output: true,
        },
      ],
    });
  });

  test('filter (Boolean)', async () => {
    const source = wrap([
      "const input = [true, false, 1, 0, 'a', ''];",
      'return input.filter(Boolean);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['Boolean'],
      input: [true, false, 1, 0, 'a', ''],
      output: [true, 1, 'a'],
      executionSteps: [
        {
          input: true,
          index: 0,
          array: [true, false, 1, 0, 'a', ''],
          output: true,
        },
        {
          input: false,
          index: 1,
          array: [true, false, 1, 0, 'a', ''],
          output: false,
        },
        {
          input: 1,
          index: 2,
          array: [true, false, 1, 0, 'a', ''],
          output: true,
        },
        {
          input: 0,
          index: 3,
          array: [true, false, 1, 0, 'a', ''],
          output: false,
        },
        {
          input: 'a',
          index: 4,
          array: [true, false, 1, 0, 'a', ''],
          output: true,
        },
        {
          input: '',
          index: 5,
          array: [true, false, 1, 0, 'a', ''],
          output: false,
        },
      ],
    });
  });

  test('map', async () => {
    const source = wrap([
      'const input = [...Array(10).keys()];',
      'return input.map(n => n ** 2);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['n => n ** 2'],
      input: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      output: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81],
      executionSteps: [
        {
          input: 0,
          index: 0,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 0,
        },
        {
          input: 1,
          index: 1,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 1,
        },
        {
          input: 2,
          index: 2,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 4,
        },
        {
          input: 3,
          index: 3,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 9,
        },
        {
          input: 4,
          index: 4,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 16,
        },
        {
          input: 5,
          index: 5,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 25,
        },
        {
          input: 6,
          index: 6,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 36,
        },
        {
          input: 7,
          index: 7,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 49,
        },
        {
          input: 8,
          index: 8,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 64,
        },
        {
          input: 9,
          index: 9,
          array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          output: 81,
        },
      ],
    });
  });

  test('map (multiple returns)', async () => {
    const source = wrap([
      'const input = [...Array(5).keys()];',
      'return input.map((value) => {',
      '  if (value === 0) {',
      '    return 100;',
      '  }',
      '  if (value === 4) return 200;',
      '});',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: [
        [
          'value => {',
          '  if (value === 0) {',
          '    return 100;',
          '  }',
          '  if (value === 4) return 200;',
          '}',
        ].join('\n'),
      ],
      input: [0, 1, 2, 3, 4],
      output: [100, undefined, undefined, undefined, 200],
      executionSteps: [
        {
          input: 0,
          index: 0,
          array: [0, 1, 2, 3, 4],
          output: 100,
        },
        {
          input: 1,
          index: 1,
          array: [0, 1, 2, 3, 4],
          output: undefined,
        },
        {
          input: 2,
          index: 2,
          array: [0, 1, 2, 3, 4],
          output: undefined,
        },
        {
          input: 3,
          index: 3,
          array: [0, 1, 2, 3, 4],
          output: undefined,
        },
        {
          input: 4,
          index: 4,
          array: [0, 1, 2, 3, 4],
          output: 200,
        },
      ],
    });
  });

  test('map (identifier callback)', async () => {
    const source = wrap([
      'const input = [...Array(5).keys()];',
      'const callback = (value) => value ** 2;',
      'return input.map(callback);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['callback'],
      input: [0, 1, 2, 3, 4],
      output: [0, 1, 4, 9, 16],
      executionSteps: [
        {
          input: 0,
          index: 0,
          array: [0, 1, 2, 3, 4],
          output: 0,
        },
        {
          input: 1,
          index: 1,
          array: [0, 1, 2, 3, 4],
          output: 1,
        },
        {
          input: 2,
          index: 2,
          array: [0, 1, 2, 3, 4],
          output: 4,
        },
        {
          input: 3,
          index: 3,
          array: [0, 1, 2, 3, 4],
          output: 9,
        },
        {
          input: 4,
          index: 4,
          array: [0, 1, 2, 3, 4],
          output: 16,
        },
      ],
    });
  });

  test('reduce', async () => {
    const source = wrap([
      'const input = [...Array(10).keys()].map(n => n + 10);',
      'return input.reduce((acc, cur) => acc + cur, 0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => acc + cur', '0'],
      input: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      output: 145,
      executionSteps: [
        {
          index: 0,
          accumulator: 0,
          current: 10,
          output: 10,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 1,
          accumulator: 10,
          current: 11,
          output: 21,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 2,
          accumulator: 21,
          current: 12,
          output: 33,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 3,
          accumulator: 33,
          current: 13,
          output: 46,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 4,
          accumulator: 46,
          current: 14,
          output: 60,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 5,
          accumulator: 60,
          current: 15,
          output: 75,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 6,
          accumulator: 75,
          current: 16,
          output: 91,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 7,
          accumulator: 91,
          current: 17,
          output: 108,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 8,
          accumulator: 108,
          current: 18,
          output: 126,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 9,
          accumulator: 126,
          current: 19,
          output: 145,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
      ],
    });
  });

  test('reduce (no initial value)', async () => {
    const source = wrap([
      'const input = [...Array(10).keys()].map(n => n + 10);',
      'return input.reduce((acc, cur) => acc + cur);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => acc + cur'],
      input: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      output: 145,
      executionSteps: [
        {
          index: 1,
          accumulator: 10,
          current: 11,
          output: 21,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 2,
          accumulator: 21,
          current: 12,
          output: 33,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 3,
          accumulator: 33,
          current: 13,
          output: 46,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 4,
          accumulator: 46,
          current: 14,
          output: 60,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 5,
          accumulator: 60,
          current: 15,
          output: 75,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 6,
          accumulator: 75,
          current: 16,
          output: 91,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 7,
          accumulator: 91,
          current: 17,
          output: 108,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 8,
          accumulator: 108,
          current: 18,
          output: 126,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 9,
          accumulator: 126,
          current: 19,
          output: 145,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
      ],
    });
  });

  test('reduce (with mutation)', async () => {
    const source = wrap([
      'const input = [...Array(10).keys()].map(n => n + 10);',
      'return input.reduce(function (acc, cur) {',
      '  input.pop();',
      '  return acc + cur;',
      '}, 0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: [
        [
          'function (acc, cur) {',
          '  input.pop();',
          '  return acc + cur;',
          '}',
        ].join('\n'),
        '0',
      ],
      input: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
      output: 60,
      executionSteps: [
        {
          index: 0,
          accumulator: 0,
          current: 10,
          output: 10,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
        },
        {
          index: 1,
          accumulator: 10,
          current: 11,
          output: 21,
          array: [10, 11, 12, 13, 14, 15, 16, 17, 18],
        },
        {
          index: 2,
          accumulator: 21,
          current: 12,
          output: 33,
          array: [10, 11, 12, 13, 14, 15, 16, 17],
        },
        {
          index: 3,
          accumulator: 33,
          current: 13,
          output: 46,
          array: [10, 11, 12, 13, 14, 15, 16],
        },
        {
          index: 4,
          accumulator: 46,
          current: 14,
          output: 60,
          array: [10, 11, 12, 13, 14, 15],
        },
      ],
    });
  });

  test('reduce (callback concise body)', async () => {
    const source = wrap([
      'const input = [...Array(3).keys()].map(n => n + 10);',
      'return input.reduce((acc, cur) => acc + cur, 0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => acc + cur', '0'],
      input: [10, 11, 12],
      output: 33,
      executionSteps: [
        {
          index: 0,
          accumulator: 0,
          current: 10,
          output: 10,
          array: [10, 11, 12],
        },
        {
          index: 1,
          accumulator: 10,
          current: 11,
          output: 21,
          array: [10, 11, 12],
        },
        {
          index: 2,
          accumulator: 21,
          current: 12,
          output: 33,
          array: [10, 11, 12],
        },
      ],
    });
  });

  test('reduce (rest element)', async () => {
    const source = wrap([
      'const input = [...Array(3).keys()].map(n => n + 10);',
      'return input.reduce((acc, ...rest) => acc + rest[0], 0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, ...rest) => acc + rest[0]', '0'],
      input: [10, 11, 12],
      output: 33,
      executionSteps: [
        {
          index: 0,
          accumulator: 0,
          current: 10,
          output: 10,
          array: [10, 11, 12],
        },
        {
          index: 1,
          accumulator: 10,
          current: 11,
          output: 21,
          array: [10, 11, 12],
        },
        {
          index: 2,
          accumulator: 21,
          current: 12,
          output: 33,
          array: [10, 11, 12],
        },
      ],
    });
  });
});

describe('Array mutating methods', () => {
  test('sort', async () => {
    const source = wrap([
      'const input = [',
      "  { name: 'Charlie' },",
      "  { name: 'Bob' },",
      "  { name: 'Alice' },",
      '];',
      'return input.sort((a, b) => a > b ? 1 : -1);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'sort',
      arguments: ['(a, b) => a > b ? 1 : -1'],
      input: [
        { name: 'Charlie' },
        { name: 'Bob' },
        { name: 'Alice' },
      ],
      output: [
        { name: 'Alice' },
        { name: 'Bob' },
        { name: 'Charlie' },
      ],
      warnings: [
        'Method `sort` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('reverse', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.reverse();',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'reverse',
      arguments: [],
      input: [1, 2, 3],
      output: [3, 2, 1],
      warnings: [
        'Method `reverse` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('splice', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.splice(0, 2);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'splice',
      arguments: ['0', '2'],
      input: [1, 2, 3],
      output: [1, 2],
      warnings: [
        'Method `splice` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('copyWithin', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5];',
      'return input.copyWithin(0, 3 ,4);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'copyWithin',
      arguments: ['0', '3', '4'],
      input: [1, 2, 3, 4, 5],
      output: [4, 2, 3, 4, 5],
      warnings: [
        'Method `copyWithin` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('fill', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5];',
      'return input.fill(0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'fill',
      arguments: ['0'],
      input: [1, 2, 3, 4, 5],
      output: [0, 0, 0, 0, 0],
      warnings: [
        'Method `fill` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('pop', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5];',
      'return input.pop();',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'pop',
      arguments: [],
      input: [1, 2, 3, 4, 5],
      output: 5,
      warnings: [
        'Method `pop` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('push', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5];',
      'return input.push(6);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'push',
      arguments: ['6'],
      input: [1, 2, 3, 4, 5],
      output: 6,
      warnings: [
        'Method `push` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('shift', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5];',
      'return input.shift();',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'shift',
      arguments: [],
      input: [1, 2, 3, 4, 5],
      output: 1,
      warnings: [
        'Method `shift` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('unshift', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5];',
      'return input.unshift(0);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'unshift',
      arguments: ['0'],
      input: [1, 2, 3, 4, 5],
      output: 6,
      warnings: [
        'Method `unshift` will mutate its input. Mutations are often problematic and can lead to confusion.',
      ],
    });
  });

  test('Mutating self reference', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.map((item, index, array) => array.reverse())',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['(item, index, array) => array.reverse()'],
      input: [1, 2, 3],
      output: [
        [3, 2, 1],
        [3, 2, 1],
        [3, 2, 1],
      ],
    });
  });

  test('Mutating self reference with slice', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.map(() => input.reverse().slice());',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['() => input.reverse().slice()'],
      input: [1, 2, 3],
      output: [
        [3, 2, 1],
        [1, 2, 3],
        [3, 2, 1],
      ],
    });
  });
});

describe('Specific scenarios', () => {
  test('Accessing object property', async () => {
    const source = wrap([
      'const input = { a: [1, 2, 3], b: [4, 5, 6] };',
      'return input.a.map(n => n + 1);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['n => n + 1'],
      input: [1, 2, 3],
      output: [2, 3, 4],
    });
  });

  test('Accessing array item', async () => {
    const source = wrap([
      'const input = [{ a: [1, 2, 3] }, { b: [4, 5, 6] }];',
      'return Object.values(input[0])',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'Object.values',
      arguments: ['input[0]'],
      input: { a: [1, 2, 3] },
      output: [[1, 2, 3]],
    });
  });

  test('Using functions declared on scope', async () => {
    const source = wrap([
      'const input = [...Array(10).keys()];',
      'const isEven = n => n % 2 === 0;',
      'return input.filter(isEven);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['isEven'],
      input: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      output: [0, 2, 4, 6, 8],
    });
  });

  test('Declaring function with let instead of const', async () => {
    const source = [
      `const ${MAIN_FUNCTION_NAME} = () => {`,
      '  return [1,2,3].map(n => n + 1);',
      '}',
    ].join('\n');

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['n => n + 1'],
      input: [1, 2, 3],
      output: [2, 3, 4],
    });
  });

  test('Map object keys and values', async () => {
    const source = wrap([
      'const input = { a: 1, b: 2, c: 3 };',
      'return Object.fromEntries(',
      '  Object.entries(input).map(item => [`${item[0]}2`, item[1] ** 2])',
      ');',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({
      method: 'Object.entries',
      arguments: ['input'],
      input: { a: 1, b: 2, c: 3 },
      output: [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ],
    });
    expect(steps[1]).toMatchObject({
      method: 'map',
      arguments: ['item => [`${item[0]}2`, item[1] ** 2]'],
      input: [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ],
      output: [
        ['a2', 1],
        ['b2', 4],
        ['c2', 9],
      ],
    });
    expect(steps[2]).toMatchObject({
      method: 'Object.fromEntries',
      arguments: [
        'Object.entries(input).map(item => [`${item[0]}2`, item[1] ** 2])',
      ],
      input: [
        ['a2', 1],
        ['b2', 4],
        ['c2', 9],
      ],
      output: { a2: 1, b2: 4, c2: 9 },
    });
  });

  test('Array mapping, filtering, slicing and reducing', async () => {
    const source = wrap([
      'const input = [1, 2, 3, 4, 5, 6, 7, 8];',
      'return input.map(i => i - 1).filter(i => i % 2 === 0).slice(2, 4).reduce((acc, cur) => acc + cur, 0)',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(4);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: ['i => i - 1'],
      input: [1, 2, 3, 4, 5, 6, 7, 8],
      output: [0, 1, 2, 3, 4, 5, 6, 7],
    });
    expect(steps[1]).toMatchObject({
      method: 'filter',
      arguments: ['i => i % 2 === 0'],
      input: [0, 1, 2, 3, 4, 5, 6, 7],
      output: [0, 2, 4, 6],
    });
    expect(steps[2]).toMatchObject({
      method: 'slice',
      arguments: ['2', '4'],
      input: [0, 2, 4, 6],
      output: [4, 6],
    });
    expect(steps[3]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => acc + cur', '0'],
      input: [4, 6],
      output: 10,
    });
  });

  test('Array of objects', async () => {
    const source = wrap([
      'const input = [',
      "  { id: 1, name: 'Renato' },",
      "  { id: 2, name: 'Böhler' },",
      '];',
      "return input.filter(item => item.name.includes('Böh'))",
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['item => item.name.includes("Böh")'],
      input: [
        { id: 1, name: 'Renato' },
        { id: 2, name: 'Böhler' },
      ],
      output: [{ id: 2, name: 'Böhler' }],
    });
  });

  test('Object of arrays', async () => {
    const source = wrap([
      'const input = { a: [1, 2, 3], b: [4, 5, 6] };',
      'return Object.entries(input).reduce((acc, cur) => {acc.push(cur[1]);return acc;}, []).flat();',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({
      method: 'Object.entries',
      arguments: ['input'],
      input: { a: [1, 2, 3], b: [4, 5, 6] },
      output: [
        ['a', [1, 2, 3]],
        ['b', [4, 5, 6]],
      ],
    });
    expect(steps[1]).toMatchObject({
      method: 'reduce',
      arguments: [
        '(acc, cur) => {\n  acc.push(cur[1]);\n  return acc;\n}',
        '[]',
      ],
      input: [
        ['a', [1, 2, 3]],
        ['b', [4, 5, 6]],
      ],
      output: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    });
  });

  test('Self reference', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.filter(i => i === input[0]);',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['i => i === input[0]'],
      input: [1, 2, 3],
      output: [1],
    });
  });

  test('Nested function calls', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.map(function(i1){ return input.filter(i2 => i2 !== i1).reduce((acc, cur) => acc + cur)});',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: [
        'function (i1) {\n  return input.filter(i2 => i2 !== i1).reduce((acc, cur) => acc + cur);\n}',
      ],
      input: [1, 2, 3],
      output: [5, 4, 3],
    });
  });

  test('Nested arrow function calls', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.map(i1 => input.filter(i2 => i2 !== i1).reduce((acc, cur) => acc + cur));',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'map',
      arguments: [
        'i1 => input.filter(i2 => i2 !== i1).reduce((acc, cur) => acc + cur)',
      ],
      input: [1, 2, 3],
      output: [5, 4, 3],
    });
  });

  test('Directly using array expression on top-level', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return ([3,4,5]).filter(n => input.includes(n));',
    ]);

    const { steps, success } = await execute(source);

    expect(success).toBe(true);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['n => input.includes(n)'],
      input: [3, 4, 5],
      output: [3],
    });
  });
});

describe('Error cases', () => {
  test('Incorrect input to method', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.reduce((acc, cur) => ({...acc, [`${cur}`]: cur ** 2}), {}).filter(a => a)',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: [
        '(acc, cur) => ({\n  ...acc,\n  [`${cur}`]: cur ** 2\n})',
        '{}',
      ],
      input: [1, 2, 3],
      output: { 1: 1, 2: 4, 3: 9 },
    });
    expect(steps[1]).toMatchObject({
      method: 'filter',
      arguments: ['a => a'],
      input: { 1: 1, 2: 4, 3: 9 },
    });
  });

  test('Null input to method', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.reduce((acc, cur) => null).reduce((acc, cur) => acc + cur)',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => null'],
      input: [1, 2, 3],
      output: null,
    });
    expect(steps[1]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => acc + cur'],
      input: null,
    });
  });

  test('Undefined input to method', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.find(a => a === 0).flatMap(a => a);',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'find',
      arguments: ['a => a === 0'],
      input: [1, 2, 3],
      output: undefined,
    });
    expect(steps[1]).toMatchObject({
      method: 'flatMap',
      arguments: ['a => a'],
      input: undefined,
    });
  });

  test('No callback to method', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.filter(n => n > 1).map();',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['n => n > 1'],
      input: [1, 2, 3],
      output: [2, 3],
    });
    expect(steps[1]).toMatchObject({
      method: 'map',
      arguments: [],
      input: [2, 3],
    });
  });

  test('No callback to flatMap', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.filter(n => n > 1).flatMap();',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['n => n > 1'],
      input: [1, 2, 3],
      output: [2, 3],
    });
    expect(steps[1]).toMatchObject({
      method: 'flatMap',
      arguments: [],
      input: [2, 3],
    });
  });

  test('No initial value on reduce for empty array', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.filter(n => n > 3).reduce((acc, cur) => acc + cur)',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'filter',
      arguments: ['n => n > 3'],
      input: [1, 2, 3],
      output: [],
    });
    expect(steps[1]).toMatchObject({
      method: 'reduce',
      arguments: ['(acc, cur) => acc + cur'],
      input: [],
    });
  });

  test('Incorrect Object.fromEntries input', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return Object.fromEntries(input);',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(1);
    expect(steps[0]).toMatchObject({
      method: 'Object.fromEntries',
      arguments: ['input'],
      input: [1, 2, 3],
    });
  });

  test('Null Object.fromEntries input', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return Object.fromEntries(input.reduce(() => null));',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['() => null'],
      input: [1, 2, 3],
      output: null,
    });
    expect(steps[1]).toMatchObject({
      method: 'Object.fromEntries',
      arguments: ['input.reduce(() => null)'],
      input: null,
    });
  });

  test('Null Object.keys input', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return Object.keys(input.reduce(() => null));',
    ]);

    const { steps, success, error } = await execute(source);

    expect(success).toBe(false);
    expect(error?.hint).not.toBe(null);
    expect(error?.hint?.examples).not.toHaveLength(0);
    expect(steps).toHaveLength(2);
    expect(steps[0]).toMatchObject({
      method: 'reduce',
      arguments: ['() => null'],
      input: [1, 2, 3],
      output: null,
    });
    expect(steps[1]).toMatchObject({
      method: 'Object.keys',
      arguments: ['input.reduce(() => null)'],
      input: null,
    });
  });
});

describe('Validations', () => {
  test('Arrow function without block statement', async () => {
    const source = `const ${MAIN_FUNCTION_NAME} = () => 1`;

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.BLOCK,
    );
  });

  test('Async function', async () => {
    const source = [
      `const ${MAIN_FUNCTION_NAME} = async () => {`,
      '  return [1, 2, 3].map(n => n + 1);',
      '}',
    ].join('\n');

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.ASYNC,
    );
  });

  test('Multiple variable declarations', async () => {
    const source = [
      `const a = 1, ${MAIN_FUNCTION_NAME} = () => {`,
      '  return ([1, 2, 3]).sort();',
      '}',
    ].join('\n');

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.VARIABLE_DECLARATION,
    );
  });

  test('Multiple statements', async () => {
    const source = [
      `const ${MAIN_FUNCTION_NAME} = () => {`,
      '  return ([1, 2, 3]).sort();',
      '};',
      'const a = 1;',
    ].join('\n');

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.ONE_STATEMENT,
    );
  });

  test('Function with no return statement', async () => {
    const source = wrap(['const input = [1, 2, 3];']);

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.RETURN,
    );
  });

  test('Function with code after return statement', async () => {
    const source = wrap([
      'const input = [1, 2, 3];',
      'return input.map(n => n + 1);',
      'input.sort();',
    ]);

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.RETURN,
    );
  });

  test('Null input', async () => {
    const source = wrap(['const input = null;', 'return input;']);

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.RETURN_TYPE,
    );
  });

  test('Undefined input', async () => {
    const source = wrap([
      'const input = undefined;',
      'return input;',
    ]);

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.RETURN_TYPE,
    );
  });

  test('String input', async () => {
    const source = wrap(["const input = 'string';", 'return input;']);

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.RETURN_TYPE,
    );
  });

  test('Number input', async () => {
    const source = wrap(['const input = 123;', 'return input;']);

    await expect(() => execute(source)).rejects.toThrow(
      INVALID_CODE_ERRORS.RETURN_TYPE,
    );
  });
});

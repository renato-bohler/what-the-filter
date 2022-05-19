import { Method } from 'src/execute/utils/types';

type DocEntry = {
  url: string;
  description: string;
};

export const MDN_DOCS: Record<Method, DocEntry> = {
  'Object.entries': {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries',
    description:
      "The Object.entries() method returns an array of a given object's own enumerable string-keyed property [key, value] pairs.",
  },
  'Object.fromEntries': {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries',
    description:
      'The Object.fromEntries() method transforms a list of key-value pairs into an object.',
  },
  'Object.values': {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values',
    description:
      "The Object.values() method returns an array of a given object's own enumerable property values",
  },
  'Object.keys': {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries',
    description:
      "The Object.keys() method returns an array of a given object's own enumerable property names.",
  },
  filter: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter',
    description:
      'The filter() method creates a new array with all elements that pass the test implemented by the provided function.',
  },
  map: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
    description:
      'The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.',
  },
  reduce: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce',
    description:
      'The reduce() method executes a reducer function (that you provide) on each element of the array, resulting in single output value.',
  },
  flatMap: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap',
    description:
      'he flatMap() method returns a new array formed by applying a given callback function to each element of the array, and then flattening the result by one level.',
  },
  find: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find',
    description:
      'The find() method returns the value of the first element in the provided array that satisfies the provided testing function.',
  },
  findIndex: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex',
    description:
      'The findIndex() method returns the index of the first element in the array that satisfies the provided testing function.',
  },
  every: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every',
    description:
      'The every() method tests whether all elements in the array pass the test implemented by the provided function.',
  },
  some: {
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some',
    description:
      'The some() method tests whether at least one element in the array passes the test implemented by the provided function. It returns a Boolean value.',
  },
  sort: { url: '', description: '' },
  reverse: { url: '', description: '' },
  splice: { url: '', description: '' },
  copyWithin: { url: '', description: '' },
  fill: { url: '', description: '' },
  pop: { url: '', description: '' },
  shift: { url: '', description: '' },
  push: { url: '', description: '' },
  unshift: { url: '', description: '' },
};

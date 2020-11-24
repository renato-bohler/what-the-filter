import {
  Node,
  VariableDeclaration,
  VariableDeclarator,
  Identifier,
  BlockStatement,
  ReturnStatement,
  ExpressionStatement,
  ArrowFunctionExpression,
  FunctionExpression,
  CallExpression,
  MemberExpression,
  ArrayExpression,
  ObjectExpression,
} from 'estree';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export type Result = {
  steps: Step[];
  success: boolean;
  error: ResultError | null;
};

export type Step = {
  method: Method;
  arguments: string[];
  warnings?: string[];
  input: Value;
  output: Value;
  executionSteps?: ExecutionSteps[];
};

export type ExecutionSteps =
  | FilterMapExecutionSteps
  | ReduceExecutionSteps;

export type FilterMapExecutionSteps = {
  input: unknown;
  index: number;
  array: unknown[];
  output: unknown;
};

export type ReduceExecutionSteps = {
  accumulator: unknown;
  current: unknown;
  index: number;
  array: unknown[];
  output: unknown;
};

export type Value =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | null
  | undefined;

export type ResultError = {
  message: string;
  hint: ResultErrorHint | null;
};

export type ResultErrorHint = {
  message: string;
  examples: {
    bad: string;
    good: string;
  }[];
};

export type Method =
  | 'Object.entries'
  | 'Object.fromEntries'
  | 'Object.values'
  | 'Object.keys'
  | 'filter'
  | 'map'
  | 'reduce'
  | 'flatMap'
  | 'find'
  | 'findIndex'
  | 'every'
  | 'some';

export const isIdentifier = (node: Node): node is Identifier =>
  node.type === 'Identifier';

export const isBlockStatement = (
  node: Node,
): node is BlockStatement => node.type === 'BlockStatement';

export const isReturnStatement = (
  node: Node,
): node is ReturnStatement => node.type === 'ReturnStatement';

export const isVariableDeclaration = (
  node: Node,
): node is VariableDeclaration => node.type === 'VariableDeclaration';

export const isVariableDeclarator = (
  node: Node,
): node is VariableDeclarator => node.type === 'VariableDeclarator';

export const isExpressionStatement = (
  node: Node,
): node is ExpressionStatement => node.type === 'ExpressionStatement';

export const isCallExpression = (
  node: Node,
): node is CallExpression => node.type === 'CallExpression';

export const isMemberExpression = (
  node: Node,
): node is MemberExpression => node.type === 'MemberExpression';

export const isArrayExpression = (
  node: Node,
): node is ArrayExpression => node.type === 'ArrayExpression';

export const isObjectExpression = (
  node: Node,
): node is ObjectExpression => node.type === 'ObjectExpression';

export const isArrowFunctionExpression = (
  node: Node,
): node is ArrowFunctionExpression =>
  node.type === 'ArrowFunctionExpression';

export const isFunctionExpression = (
  node: Node,
): node is FunctionExpression => node.type === 'FunctionExpression';

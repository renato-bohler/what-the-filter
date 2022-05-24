import { generate, replace } from 'abstract-syntax-tree';
import {
  CallExpression,
  ExpressionStatement,
  MemberExpression,
  Program,
  VariableDeclaration,
} from 'estree';

import {
  EXECUTION_STEP_VARIABLE_NAME,
  EXECUTION_STEPS_VARIABLE_NAME,
  MAIN_FUNCTION_NAME,
} from './const';
import { getFirstNodeFromSource } from './getFirstNodeFromSource';
import { sandbox } from './sandbox';
import {
  ExecutionSteps,
  isArrowFunctionExpression,
  isBlockStatement,
  isExpressionStatement,
  isFunctionExpression,
  isIdentifier,
  isReturnStatement,
  isVariableDeclarator,
  Step,
} from './types';

const getTransformedCallback = (
  tree: Program,
  currentNode: CallExpression,
  parameters: string[],
) => {
  /**
   * Transforms `Boolean` to `(...args) => Boolean(...args)`.
   */
  if (isIdentifier(currentNode.arguments[0])) {
    const identifier = currentNode.arguments[0].name;
    currentNode.arguments[0] = (
      getFirstNodeFromSource(
        `(...args) => ${identifier}(...args)`,
      ) as ExpressionStatement
    ).expression;
  }

  const callback = currentNode.arguments[0];

  if (
    !isArrowFunctionExpression(callback) &&
    !isFunctionExpression(callback)
  )
    return;

  /**
   * Transforms arrow functions to functions, to make use of `arguments` later.
   */
  callback.type = 'FunctionExpression';
  if (!isBlockStatement(callback.body)) {
    callback.body = {
      type: 'BlockStatement',
      body: [
        {
          type: 'ReturnStatement',
          argument: callback.body,
        },
      ],
    };
  }

  /**
   * Adds `const executionStep = {...}` and `executionSteps.push(executionStep)`
   * to the first line of the callback function.
   *
   * Makes use of `arguments` to avoid completixy.
   */
  callback.body.body.unshift(
    getFirstNodeFromSource(
      `const ${EXECUTION_STEP_VARIABLE_NAME} = {
        ${parameters
          .map(
            (argument, index) =>
              `${argument}: JSON.parse(JSON.stringify(arguments[${index}]))`,
          )
          .join(',')},
          output: undefined,
       }`,
    ) as VariableDeclaration,
    getFirstNodeFromSource(
      `${EXECUTION_STEPS_VARIABLE_NAME}.push(${EXECUTION_STEP_VARIABLE_NAME})`,
    ) as ExpressionStatement,
  );

  /**
   * Replaces all return statements with assignments to `executionStep.output`.
   */
  replace(callback, {
    enter: (node) => {
      if (!isReturnStatement(node)) return node;
      if (!node.argument) return node;

      const assignmentExpression = getFirstNodeFromSource(
        `${EXECUTION_STEP_VARIABLE_NAME}.output = undefined`,
      ) as ExpressionStatement;

      return {
        ...assignmentExpression,
        expression: {
          ...assignmentExpression.expression,
          right: node.argument,
        },
      };
    },
  });

  /**
   * Adds `return executionStep.output` on the last line of the callback.
   */
  callback.body.body.push({
    type: 'ReturnStatement',
    argument: getFirstNodeFromSource(
      `${EXECUTION_STEP_VARIABLE_NAME}.output`,
    ) as MemberExpression,
  });

  let replaced = false;
  const source = generate(currentNode);
  const argument = getFirstNodeFromSource(source);
  const newTree = replace(tree, {
    enter: (node) => {
      /**
       * Removes the original return of the main function.
       */
      if (isReturnStatement(node)) {
        if (replaced) return node;
        if (!argument) return node;
        if (!isExpressionStatement(argument)) return node;
        replaced = true;

        return argument.expression;
      }

      /**
       * Wraps the main function body in
       * `const executionSteps = [];` and
       * `return executionSteps;`.
       */
      if (isVariableDeclarator(node)) {
        if (!isIdentifier(node.id)) return node;
        if (node.id.name !== MAIN_FUNCTION_NAME) return node;
        if (!node.init) return node;
        if (!isArrowFunctionExpression(node.init)) return node;
        if (!isBlockStatement(node.init.body)) return node;
        return {
          ...node,
          init: {
            ...node.init,
            body: {
              ...node.init.body,
              body: [
                getFirstNodeFromSource(
                  `const ${EXECUTION_STEPS_VARIABLE_NAME} = []`,
                ) as VariableDeclaration,
                ...node.init.body.body,
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'Identifier',
                    name: EXECUTION_STEPS_VARIABLE_NAME,
                  },
                },
              ],
            },
          },
        };
      }

      return node;
    },
  });

  return generate(newTree);
};

const generateStepExecution = async (
  source: string,
): Promise<ExecutionSteps[]> => {
  return await sandbox<ExecutionSteps[]>(`
    ${source};
    return ${MAIN_FUNCTION_NAME}();
  `);
};

const generateStepByStepExecution = (
  tree: Program,
  currentNode: CallExpression,
  parameters: string[],
) => {
  const transformedCallback = getTransformedCallback(
    tree,
    currentNode,
    parameters,
  );

  if (!transformedCallback) return;

  const executionSteps = generateStepExecution(transformedCallback);

  return executionSteps;
};

export const getStepByStepExecution = async (
  tree: Program,
  step: Step,
  node: CallExpression,
): Promise<ExecutionSteps[] | undefined> => {
  const treeCopy = JSON.parse(JSON.stringify(tree));
  const nodeCopy = JSON.parse(JSON.stringify(node));

  if (step.method === 'filter' || step.method === 'map')
    return await generateStepByStepExecution(treeCopy, nodeCopy, [
      'input',
      'index',
      'array',
    ]);

  if (step.method === 'reduce')
    return await generateStepByStepExecution(treeCopy, nodeCopy, [
      'accumulator',
      'current',
      'index',
      'array',
    ]);

  return;
};

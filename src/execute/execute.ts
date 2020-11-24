import { parse, generate } from 'abstract-syntax-tree';

import { getCallExpressionQueue } from './utils/getCallExpressionQueue';
import { getErrorHint } from './utils/getErrorHint';
import { getPartialValue } from './utils/getPartialValue';
import { getRootCallExpression } from './utils/getRootCallExpression';
import { getStepByStepExecution } from './utils/getStepByStepExecution';
import { getWarnings } from './utils/getWarnings';
import {
  ValidationError,
  Result,
  Step,
  Method,
  isIdentifier,
  isCallExpression,
  isMemberExpression,
  isArrayExpression,
  isObjectExpression,
} from './utils/types';

export const execute = (source: string): Result => {
  const steps: Step[] = [];

  try {
    const tree = parse(source);
    const callExpression = getRootCallExpression(tree);
    const executionSteps = getCallExpressionQueue(callExpression);

    executionSteps.forEach((node, index) => {
      if (!isMemberExpression(node.callee)) return;
      if (!isIdentifier(node.callee.property)) return;
      if (
        !isIdentifier(node.callee.object) &&
        !isArrayExpression(node.callee.object) &&
        !isObjectExpression(node.callee.object) &&
        !isCallExpression(node.callee.object) &&
        !isMemberExpression(node.callee.object)
      )
        return;

      const method = node.callee.property.name;
      const isObject =
        isIdentifier(node.callee.object) &&
        node.callee.object.name === 'Object';

      const args = node.arguments.map((argument) =>
        generate(argument),
      );

      const step = {} as Step;
      steps.push(step);
      step.method = `${isObject ? 'Object.' : ''}${method}` as Method;
      step.arguments = args;
      if (index === 0) {
        step.input = isObject
          ? getPartialValue(tree, `(${generate(node.arguments[0])})`)
          : getPartialValue(tree, generate(node.callee.object));
      } else {
        step.input = steps[index - 1].output;
      }

      step.output = getPartialValue(tree, generate(node));
      try {
        step.executionSteps = getStepByStepExecution(
          tree,
          step,
          node,
        );
      } catch (e) {}
      step.warnings = getWarnings(step);
    });

    return {
      steps,
      success: true,
      error: null,
    };
  } catch (error) {
    if (error instanceof ValidationError) throw error;

    return {
      steps,
      success: false,
      error: {
        message: error.message,
        hint: getErrorHint(error, steps[steps.length - 1]),
      },
    };
  }
};

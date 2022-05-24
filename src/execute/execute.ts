import { generate, parse } from 'abstract-syntax-tree';

import { getCallExpressionQueue } from './utils/getCallExpressionQueue';
import { getErrorHint } from './utils/getErrorHint';
import { getPartialValue } from './utils/getPartialValue';
import { getRootCallExpression } from './utils/getRootCallExpression';
import { getStepByStepExecution } from './utils/getStepByStepExecution';
import { getWarnings } from './utils/getWarnings';
import {
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
  Method,
  Result,
  Step,
  ValidationError,
} from './utils/types';

export const execute = async (source: string): Promise<Result> => {
  const steps: Step[] = [];

  try {
    const tree = parse(source);
    const callExpression = getRootCallExpression(tree);
    const executionSteps = getCallExpressionQueue(callExpression);

    for (const [index, node] of executionSteps.entries()) {
      if (!isMemberExpression(node.callee)) continue;
      if (!isIdentifier(node.callee.property)) continue;
      if (
        !isIdentifier(node.callee.object) &&
        !isArrayExpression(node.callee.object) &&
        !isObjectExpression(node.callee.object) &&
        !isCallExpression(node.callee.object) &&
        !isMemberExpression(node.callee.object)
      )
        continue;

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
        step.input = await getPartialValue(
          tree,
          isObject
            ? `(${generate(node.arguments[0])})`
            : generate(node.callee.object),
        );
      } else {
        step.input = steps[index - 1].output;
      }

      step.output = await getPartialValue(tree, generate(node));
      try {
        step.executionSteps = await getStepByStepExecution(
          tree,
          step,
          node,
        );
      } catch (e) {}
      step.warnings = getWarnings(step);
    }

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
        message: (error as Error).message,
        hint: getErrorHint(error as Error, steps[steps.length - 1]),
      },
    };
  }
};

import { replace, generate } from 'abstract-syntax-tree';
import { Program } from 'estree';

import { MAIN_FUNCTION_NAME } from './const';
import { getFirstNodeFromSource } from './getFirstNodeFromSource';
import {
  Value,
  isReturnStatement,
  isExpressionStatement,
} from './types';

export const getPartialValue = (
  tree: Program,
  source: string,
): Value => {
  let replaced = false;
  const treeCopy = JSON.parse(JSON.stringify(tree));
  const returnExpression = getFirstNodeFromSource(source);
  const newTree = replace(treeCopy, {
    enter: (node) => {
      if (replaced) return node;
      if (!isReturnStatement(node)) return node;
      if (!returnExpression) return node;
      if (!isExpressionStatement(returnExpression)) return node;
      replaced = true;
      return { ...node, argument: returnExpression.expression };
    },
  });

  // eslint-disable-next-line no-new-func
  return new Function(
    `${generate(newTree)}; return ${MAIN_FUNCTION_NAME}();`,
  )();
};

import { generate, replace } from 'abstract-syntax-tree';
import { Program } from 'estree';

import { MAIN_FUNCTION_NAME } from './const';
import { getFirstNodeFromSource } from './getFirstNodeFromSource';
import { sandbox } from './sandbox';
import {
  isExpressionStatement,
  isReturnStatement,
  Value,
} from './types';

export const getPartialValue = async (
  tree: Program,
  source: string,
): Promise<Value> => {
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

  return await sandbox<Value>(`
    ${generate(newTree)};
    return ${MAIN_FUNCTION_NAME}();
  `);
};

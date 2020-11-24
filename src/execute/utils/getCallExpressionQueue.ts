import { find, traverse } from 'abstract-syntax-tree';
import { CallExpression } from 'estree';

const markSkipNestedCalls = (node: SkippableNode) => {
  const nestedCalls = find(node, { type: 'CallExpression' });
  nestedCalls.forEach((callExpression) => {
    callExpression.skip = true;
  });
};

export const getCallExpressionQueue = (
  rootCallExpression: CallExpression,
): CallExpression[] => {
  const nodes: CallExpression[] = [];

  traverse(rootCallExpression, {
    enter(node: SkippableNode) {
      if (node.skip) return;

      if (
        node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression'
      )
        markSkipNestedCalls(node);

      if (node.type !== 'CallExpression') return;

      nodes.unshift(node);
    },
  });

  return nodes;
};

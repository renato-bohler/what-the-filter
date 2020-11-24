import { parse } from 'abstract-syntax-tree';
import { Node } from 'estree';

export const getFirstNodeFromSource = (
  source: string,
): Node | undefined => {
  const parsed = parse(source);
  if (parsed.body.length !== 1) return;
  return parsed.body[0];
};

declare type AstringOptions = import('astring').Options;
declare type ESTreeNode = import('estree').Node;
declare type ESTreeProgram = import('estree').Program;
declare type ESTreeCallExpression = import('estree').CallExpression;
declare type ESTraverseVisitor = import('estraverse').Visitor;
declare type MeriyahOptions = import('meriyah').Options;

type SkippableNode = ESTreeNode & { skip?: boolean };

declare module 'abstract-syntax-tree' {
  export function parse(
    source: string,
    options?: MeriyahOptions,
  ): ESTreeProgram;
  export function find(
    tree: SkippableNode,
    selector: { type: string },
  ): SkippableNode[];
  export function traverse(
    tree: SkippableNode,
    options: ESTraverseVisitor,
  ): void;
  export function replace(
    tree: SkippableNode,
    options: ESTraverseVisitor,
  ): ESTreeProgram;
  export function generate(
    tree: SkippableNode,
    options?: AstringOptions,
  ): string;
}

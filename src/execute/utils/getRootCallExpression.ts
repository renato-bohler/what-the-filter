import { Program, CallExpression } from 'estree';

import { INVALID_CODE_ERRORS, MAIN_FUNCTION_NAME } from './const';
import {
  ValidationError,
  isIdentifier,
  isBlockStatement,
  isReturnStatement,
  isVariableDeclaration,
  isVariableDeclarator,
  isCallExpression,
  isArrowFunctionExpression,
} from './types';

const {
  GENERIC,
  ONE_STATEMENT,
  VARIABLE_DECLARATION,
  NAME,
  ASYNC,
  ARROW,
  RETURN,
  RETURN_TYPE,
  BLOCK,
} = INVALID_CODE_ERRORS;

export const getRootCallExpression = (
  tree: Program,
): CallExpression => {
  if (tree.body.length !== 1)
    throw new ValidationError(ONE_STATEMENT);

  const statement = tree.body[0];
  if (!isVariableDeclaration(statement))
    throw new ValidationError(VARIABLE_DECLARATION);
  if (statement.declarations.length !== 1)
    throw new ValidationError(VARIABLE_DECLARATION);

  const declaration = statement.declarations[0];
  if (!isVariableDeclarator(declaration))
    throw new ValidationError(VARIABLE_DECLARATION);
  if (!isIdentifier(declaration.id))
    throw new ValidationError(VARIABLE_DECLARATION);
  if (declaration.id.name !== MAIN_FUNCTION_NAME)
    throw new ValidationError(NAME);
  if (!declaration.init) throw new ValidationError(GENERIC);
  if (!isArrowFunctionExpression(declaration.init))
    throw new ValidationError(ARROW);
  if (declaration.init.async) throw new ValidationError(ASYNC);

  const body = declaration.init.body;
  if (!isBlockStatement(body)) throw new ValidationError(BLOCK);

  const lastStatement = body.body[body.body.length - 1];
  if (!isReturnStatement(lastStatement))
    throw new ValidationError(RETURN);
  if (!lastStatement.argument) throw new ValidationError(RETURN_TYPE);
  if (!isCallExpression(lastStatement.argument))
    throw new ValidationError(RETURN_TYPE);

  return lastStatement.argument;
};

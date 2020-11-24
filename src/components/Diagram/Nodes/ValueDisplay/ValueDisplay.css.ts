import styled from 'styled-components';

export const GenericValue = styled.span`
  font-family: monospace;
  font-size: 11px;
`;

export const NullValue = styled.span`
  font-family: monospace;
  font-weight: bold;
  font-size: 11px;

  color: #dc322f;
  background: #ebebeb;

  padding: 1px 2px;
  border-radius: 3px;
`;

export const UndefinedValue = styled.span`
  font-family: monospace;
  font-size: 11px;

  color: #586e75;
  background: #ebebeb;

  padding: 1px 2px;
  border-radius: 3px;
`;

export const StringValue = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: #cb4b16;
`;

export const NumberValue = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: #268bd2;
`;

export const NaNValue = styled.span`
  font-family: monospace;
  font-weight: bold;
  font-size: 11px;

  color: #d33682;
  background: #ebebeb;

  padding: 1px 2px;
  border-radius: 3px;
`;

export const BooleanValue = styled.span`
  font-family: monospace;
  font-size: 11px;
  color: #2aa198;
`;

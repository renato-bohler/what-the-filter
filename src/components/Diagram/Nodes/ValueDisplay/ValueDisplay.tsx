import React from 'react';
import ReactJSON from 'react-json-view';

import { Value } from 'src/execute/utils/types';

import {
  GenericValue,
  NullValue,
  UndefinedValue,
  StringValue,
  NumberValue,
  NaNValue,
  BooleanValue,
} from './ValueDisplay.css';

type Props = {
  value: Value | unknown;
  collapsed?: boolean;
};

const ValueType: React.FC<Props> = ({ value, collapsed }) => {
  if (value === null) return <NullValue>NULL</NullValue>;
  if (value === undefined)
    return <UndefinedValue>undefined</UndefinedValue>;
  if (typeof value === 'object' && value !== null)
    return (
      <ReactJSON
        src={value}
        displayDataTypes={false}
        enableClipboard={false}
        name={null}
        collapsed={collapsed}
        groupArraysAfterLength={10}
      />
    );
  if (typeof value === 'string')
    return <StringValue>{`"${value}"`}</StringValue>;
  if (typeof value === 'number') {
    if (isNaN(value)) return <NaNValue>NaN</NaNValue>;
    return <NumberValue>{value}</NumberValue>;
  }
  if (typeof value === 'boolean')
    return <BooleanValue>{JSON.stringify(value)}</BooleanValue>;
  return <GenericValue>{JSON.stringify(value)}</GenericValue>;
};

export const ValueDisplay: React.FC<Props> = ({
  value,
  collapsed,
}) => (
  <div className="value-display">
    <ValueType value={value} collapsed={collapsed} />
  </div>
);

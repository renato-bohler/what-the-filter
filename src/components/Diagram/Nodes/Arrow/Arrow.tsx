import React from 'react';

import { ValueNode } from 'src/components/Diagram/Nodes/ValueNode/ValueNode';
import { Value } from 'src/execute/utils/types';

import { Circle, Container, Shaft, Tip } from './Arrow.css';

type Props = {
  value?: Value;
  open?: boolean;
  toggleOpen?: () => void;
};

export const Arrow: React.VFC<Props> = ({
  value,
  open = false,
  toggleOpen = () => {},
}) => (
  <Container>
    <Circle />
    <Shaft />
    {value && (
      <>
        <ValueNode
          small
          value={value}
          open={open}
          toggleOpen={toggleOpen}
        />
        <Shaft />
      </>
    )}
    <Tip />
  </Container>
);

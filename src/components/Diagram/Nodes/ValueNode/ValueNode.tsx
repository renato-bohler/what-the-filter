import React from 'react';

import { ReactComponent as Check } from 'src/assets/check.svg';
import { ReactComponent as Circle } from 'src/assets/circle.svg';
import { ReactComponent as Close } from 'src/assets/close.svg';
import { ValueDisplay } from 'src/components/Diagram/Nodes/ValueDisplay/ValueDisplay';
import { ResultError, Value } from 'src/execute/utils/types';

import {
  Container,
  Content,
  CollapseButton,
  ErrorContainer,
  ErrorMessage,
  ErrorHintExample,
  ErrorHintBadExample,
  ErrorHintGoodExample,
  ErrorHintComment,
  ErrorHint,
} from './ValueNode.css';

type Props = {
  value: Value;
  open: boolean;
  toggleOpen: () => void;
  small?: boolean;
  type?: 'dot' | 'check' | 'error';
  error?: ResultError | null;
};

type IconProps = {
  $size: number;
  $type: 'dot' | 'check' | 'error';
};

type ErrorContentProps = {
  error: ResultError;
};

const Icon: React.FC<IconProps> = ({ $size, $type }) => {
  if ($type === 'dot') return <Circle width={$size} height={$size} />;
  if ($type === 'error')
    return <Close width={$size} height={$size} />;
  return <Check width={$size} height={$size} />;
};

const ErrorContent: React.FC<ErrorContentProps> = ({ error }) => (
  <ErrorContainer>
    <h1>Error</h1>
    <h2>Message</h2>
    <ErrorMessage>{error.message}</ErrorMessage>
    {error.hint && (
      <>
        <h2>Hint</h2>
        <ErrorHint>{error.hint.message}</ErrorHint>
        {error.hint.examples.map((example) => (
          <ErrorHintExample key={`${example.bad} ${example.good}`}>
            <div>
              <ErrorHintComment>
                {'// Bad example ✗'}
              </ErrorHintComment>
            </div>
            <div>
              <ErrorHintBadExample>
                - {example.bad}
              </ErrorHintBadExample>
            </div>
            <div>
              <span> </span>
            </div>
            <div>
              <ErrorHintComment>
                {'// Good example ✔'}
              </ErrorHintComment>
            </div>
            <div>
              <ErrorHintGoodExample>
                + {example.good}
              </ErrorHintGoodExample>
            </div>
          </ErrorHintExample>
        ))}
      </>
    )}
  </ErrorContainer>
);

export const ValueNode: React.FC<Props> = ({
  value,
  open,
  toggleOpen,
  small = false,
  type = 'dot',
  error,
}) => (
  <Container>
    <Content $open={open} $small={small}>
      {type === 'error' && error ? (
        <ErrorContent error={error} />
      ) : (
        <ValueDisplay value={value} />
      )}
    </Content>
    <CollapseButton
      $open={open}
      $small={small}
      $color={type === 'error' ? '#f23333' : '#40cc1d'}
      onMouseUp={toggleOpen}
    >
      {open ? '-' : <Icon $type={type} $size={small ? 16 : 24} />}
    </CollapseButton>
  </Container>
);

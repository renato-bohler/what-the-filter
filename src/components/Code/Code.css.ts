import BaseSelect from 'react-select';

import BaseEditor from '@monaco-editor/react';
import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  padding: 16px;

  user-select: none;
`;

export const Description = styled.span`
  font-size: 0.9em;
  font-weight: normal;
`;

export const Select = styled(BaseSelect)`
  min-width: min(100%, 500px);
  margin-bottom: 16px;

  .select__control {
    background: #1e1e1e;
  }

  .select__single-value {
    color: white;
    font-size: 1.5em;
  }

  .select__value-container {
    justify-content: center;
  }

  .select__input {
    color: white;

    & > input {
      font-family: Sriracha;
    }
  }

  .select__menu {
    background-color: #262626;
  }

  .select__option {
    text-align: center;
  }

  .select__option--is-focused {
    background: #f2333380;
  }

  .select__option--is-selected {
    background: #f23333;
  }

  .select__group {
    padding: 0;
  }

  .select__group-heading {
    height: 30px;
    line-height: 30px;
    border: none;
    margin: 0;

    text-align: center;
    font-family: monospace;
    font-weight: bold;
    color: white;
    background: #f2333320;
  }
`;

export const Editor = styled(BaseEditor)`
  max-width: ${({ width }) => `min(1200px, ${width}px)`};
  min-height: 300px;

  border-radius: 12px;
  overflow: hidden;
  border: 2px solid white;

  flex: 1;
  margin: 0 auto;
`;

export const Loading = styled.div<{ width?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: ${({ width }) => `min(1200px, ${width || 1200}px)`};
  height: 100%;
  flex: 1;

  border-radius: 12px;
  overflow: hidden;
  border: 2px solid white;
  background: #1e1e1e;
`;

export const Button = styled.button`
  background: #f23333;
  border-radius: 12px;
  border: 3px solid black;
  box-shadow: 0 0 0 2px white;
  width: fit-content;
  min-height: 63px;
  align-self: center;
  margin-top: -32px;
  z-index: 1;

  font-family: Sriracha;
  font-size: 32px;
  padding: 0 32px;
  color: white;
  cursor: pointer;
`;

import BaseSelect from 'react-select';
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
    z-index: 10;
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
` as typeof BaseSelect;

import styled from 'styled-components';

export const Subtitle = styled.h2`
  font-size: 1.4em;
  margin: 32px 0 4px 0;
`;

export const CheckboxContainer = styled.div`
  margin-left: auto;
  max-width: fit-content;
  margin-bottom: 8px;

  & > label {
    display: flex;
    align-items: center;

    & > input {
      margin-left: 8px;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border: 1px solid black;

  * > th {
    font-size: 1.2em;
    background: rgba(0, 0, 0, 0.25);
  }

  * > td {
    border: 1px solid black;
    padding: 16px;
  }
`;

export const Code = styled.div`
  background: #bdbdbd;
  border-left: 4px solid #7c7c7c;
  border-radius: 5px;
  padding: 8px;
  white-space: pre-wrap;
`;

import styled from 'styled-components';

export const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  background: #393939;
  padding: 24px;
  margin-top: auto;
  font-family: monospace;

  * > em {
    color: #f23333;
  }

  * > a {
    color: #f23333;
    font-weight: bold;
    text-decoration: none;
    font-size: 1.1em;

    &:hover {
      color: #f23333a0;
      text-decoration: underline;
    }
  }
`;

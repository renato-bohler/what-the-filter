import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  background: #1a1a1a;
  padding: 16px;

  user-select: none;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: normal;
  text-align: center;
  max-width: 400px;
  margin-top: 24px;
`;

export const Logo = styled.img`
  max-width: 450px;
  width: 100%;
  height: auto;
`;

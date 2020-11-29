import styled from 'styled-components';

import { ReactComponent as Twitter } from 'src/assets/twitter.svg';

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

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const TwitterButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #dddddd;
  background-image: linear-gradient(180deg, #eeeeee 0, #dddddd);
  background-repeat: no-repeat;

  border: 1px solid #cccccc;
  border-radius: 6px;

  font-family: Sriracha;
  font-size: 16px;
  text-decoration: none;
  color: #1da1f2;

  margin: 4px;
  padding: 4px 20px 4px 16px;

  cursor: pointer;
`;

export const TwitterIcon = styled(Twitter)`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

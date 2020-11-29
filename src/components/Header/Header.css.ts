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

  background-color: #eeeeee;
  background-image: linear-gradient(
    to bottom,
    #fcfcfc 0,
    #eeeeee 100%
  );
  background-repeat: no-repeat;

  border: 1px solid #d5d5d5;
  border-radius: 6px;

  font-family: Sriracha;
  font-size: 16px;
  text-decoration: none;
  color: #1da1f2;

  margin: 4px;
  padding: 4px 20px 4px 16px;

  cursor: pointer;

  &:hover,
  &:focus {
    background-color: #dddddd;
    background-image: linear-gradient(
      to bottom,
      #eee 0,
      #dddddd 100%
    );
    border-color: #cccccc;
  }

  &:active {
    background-image: none;
    background-color: #dcdcdc;
    border-color: #b5b5b5;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
  }
`;

export const TwitterIcon = styled(Twitter)`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

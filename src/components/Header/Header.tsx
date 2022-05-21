import React from 'react';

import GitHubButton from 'react-github-button';

import logo from 'src/assets/logo.png';

import {
  ButtonsContainer,
  Container,
  Logo,
  Title,
  TwitterButton,
  TwitterIcon,
} from './Header.css';

export const Header: React.FC = () => (
  <Container>
    <Logo src={logo} alt="what the filter? logo" />
    <Title>
      A visual playground to JavaScript array & object transformations
    </Title>

    <ButtonsContainer>
      <GitHubButton
        type="stargazers"
        namespace="renato-bohler"
        repo="what-the-filter"
      />
      <TwitterButton
        href="https://twitter.com/intent/tweet?text=Check+out+%22what+the+filter%22%3A+a+visual+playground+to+JavaScript+array+%26+object+transformations.&url=https%3A%2F%2Frenato-bohler.github.io%2Fwhat-the-filter%2F&hashtags=javascript&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton"
        target="_blank"
      >
        <TwitterIcon />
        Tweet
      </TwitterButton>
    </ButtonsContainer>
  </Container>
);

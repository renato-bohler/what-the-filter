import React from 'react';
import GitHubButton from 'react-github-button';

import logo from 'src/assets/logo.png';

import { Container, Logo, Title } from './Header.css';

export const Header: React.VFC = () => (
  <Container>
    <Logo src={logo} alt="what the filter? logo" />
    <Title>
      A visual playground to JavaScript array & object transformations
    </Title>
    <GitHubButton
      type="stargazers"
      namespace="renato-bohler"
      repo="what-the-filter"
    />
  </Container>
);

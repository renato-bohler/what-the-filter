import React from 'react';

import { Container } from './Footer.css';

export const Footer: React.VFC = () => (
  <Container>
    <span>
      Designed and developed with <em>♥</em>
      <br />
      by{' '}
      <a
        href="https://renato-bohler.github.io/"
        rel="noopener noreferrer"
      >
        Renato Böhler
      </a>
    </span>
  </Container>
);

import BaseEditor from '@monaco-editor/react';
import styled from 'styled-components';

type WithFullscreen = { $fullscreen: boolean };

const MENU_BAR_HEIGHT = 50;
const FOOTER_HEIGHT = 40;

export const Container = styled.div<WithFullscreen>`
  position: ${({ $fullscreen }) =>
    $fullscreen ? 'static' : 'relative'};
  height: 100%;

  & > section:last-child {
    position: ${({ $fullscreen }) =>
      $fullscreen ? 'absolute !important' : 'relative'};
    top: ${({ $fullscreen }) =>
      $fullscreen ? MENU_BAR_HEIGHT : 0}px;
    right: 0;
    left: 0;
    z-index: ${({ $fullscreen }) => ($fullscreen ? '2' : '1')};

    width: ${({ $fullscreen }) =>
      $fullscreen ? 'auto !important' : 'inherit'};
    height: ${({ $fullscreen }) =>
      $fullscreen
        ? `calc(100% - ${
            MENU_BAR_HEIGHT + FOOTER_HEIGHT
          }px) !important`
        : '100%'};
  }
`;

export const MenuBar = styled.div<WithFullscreen>`
  display: ${({ $fullscreen }) => ($fullscreen ? 'flex' : 'none')};
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  width: 100%;
  height: ${MENU_BAR_HEIGHT}px;

  background: black;
`;

export const MenuBarButtonContainer = styled.div`
  margin-left: auto;
  height: 100%;
`;

export const MenuBarButton = styled.button`
  background: #2e2e2e;
  border: none;

  font-family: Sriracha;
  font-size: 20px;
  color: white;

  height: 100%;
  padding: 0 16px;

  cursor: pointer;
`;

export const MonacoEditor = styled(BaseEditor)<WithFullscreen>`
  min-height: 300px;

  border-radius: ${({ $fullscreen }) => ($fullscreen ? '0' : '12px')};
  overflow: hidden;
  border: ${({ $fullscreen }) =>
    $fullscreen ? 'none' : '2px solid white'};

  flex: 1;
`;

export const Footer = styled.div<WithFullscreen>`
  display: ${({ $fullscreen }) => ($fullscreen ? 'flex' : 'none')};
  align-items: center;
  justify-content: space-between;

  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 3;

  width: 100%;
  height: ${FOOTER_HEIGHT}px;
  padding: 0 16px;

  font-family: monospace;
  background: black;
`;

export const FooterLink = styled.a`
  color: #f23333;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    color: #f23333a0;
    text-decoration: underline;
  }
`;

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  flex: 1;

  border-radius: 12px;
  overflow: hidden;
  /* border: 2px solid white; */
  background: #1e1e1e;
`;

export const IconButton = styled.button<WithFullscreen>`
  position: absolute;
  top: ${({ $fullscreen }) =>
    16 + ($fullscreen ? MENU_BAR_HEIGHT : 0)}px;
  right: 32px;
  z-index: 3;

  margin: 0;
  padding: 8px;
  width: 48px;
  height: 48px;

  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: white;

  cursor: pointer;
  transition: background 150ms ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
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

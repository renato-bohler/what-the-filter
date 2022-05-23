import BaseEditor from '@monaco-editor/react';
import BaseSelect from 'react-select';
import styled from 'styled-components';

type WithFullscreen = { $fullscreen: boolean };

const MENU_BAR_HEIGHT = 50;
const FOOTER_HEIGHT = 40;

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

export const EditorWrapper = styled.div<WithFullscreen>`
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

export const EditorMenuBar = styled.div<WithFullscreen>`
  display: ${({ $fullscreen }) => ($fullscreen ? 'flex' : 'none')};
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;

  width: 100%;
  height: ${MENU_BAR_HEIGHT}px;

  background: black;
  padding-left: 16px;
`;

export const MenuBarButtonContainer = styled.div`
  margin-left: auto;
  height: 100%;
`;

export const MenuBarButton = styled.button`
  background: #f23333;
  border: none;

  font-family: Sriracha;
  font-size: 20px;
  color: white;

  height: 100%;
  padding: 0 16px;

  cursor: pointer;
`;

export const Editor = styled(BaseEditor)<WithFullscreen>`
  min-height: 300px;

  border-radius: ${({ $fullscreen }) => ($fullscreen ? '0' : '12px')};
  overflow: hidden;
  border: ${({ $fullscreen }) =>
    $fullscreen ? 'none' : '2px solid white'};

  flex: 1;
`;

export const EditorFooter = styled.div<WithFullscreen>`
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

import styled from 'styled-components';

import grid from 'src/assets/grid.png';

type ContainerProps = {
  $isOpen: boolean;
};

export const Container = styled.section<ContainerProps>`
  position: relative;
  z-index: 2;

  height: 100vh;
  background-color: #010710;
  background-size: 45px 45px;
  background-image: ${`url(${grid})`};
  box-shadow: inset 0 40px 40px -20px rgba(255, 255, 255, 0.3);
  overflow: hidden;
  user-select: none;

  @media (hover: none) and (pointer: coarse) {
    position: fixed;
    touch-action: none;

    transition: width 0.5s ease-in-out;
    transition-property: width, height, left, top;
    width: ${({ $isOpen }) => ($isOpen ? 100 : 0)}vw;
    height: ${({ $isOpen }) => ($isOpen ? 100 : 0)}vh;
    left: ${({ $isOpen }) => ($isOpen ? 0 : 50)}%;
    top: ${({ $isOpen }) => ($isOpen ? 0 : 50)}%;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  background: none;
  border: 2px solid rgba(255, 255, 255, 0.75);
  border-radius: 50%;

  font-family: monospace;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.75);

  cursor: pointer;
`;

export const NodesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
`;

export const ZoomContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 2px;

  height: 80px;
`;

export const ZoomButton = styled.button`
  color: #555555;
  font-family: monospace;
  font-size: 24px;

  background: none;
  border: none;
  cursor: pointer;

  padding: 4px 8px;
`;

export const ZoomDivider = styled.hr`
  width: 80%;
  min-height: 1px;
  background: #aaaaaa;
`;

export const ToggleButton = styled.button`
  position: absolute;
  bottom: 16px;
  left: 21px;

  color: #555555;
  font-family: monospace;
  font-size: 16px;
  cursor: pointer;

  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 2px;

  padding: 4px 8px;
`;

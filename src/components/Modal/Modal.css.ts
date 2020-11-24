import styled from 'styled-components';

type BackdropProps = {
  $visible: boolean;
};

export const Backdrop = styled.div<BackdropProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.75);

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'all' : 'none')};

  transition: opacity 500ms ease-in-out;
`;

export const Window = styled.section`
  width: 60vw;
  height: 80vh;

  max-width: 800px;
  max-height: 800px;

  background: white;
  border-radius: 25px;

  padding: 16px;
  z-index: 2;

  font-family: monospace;
  color: black;

  @media only screen and (max-width: 899px) {
    min-width: 100vw;
    min-height: 100vh;

    max-width: none;
    max-height: none;

    border-radius: 0;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid gray;
  margin-bottom: 16px;
  padding-bottom: 16px;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  background: none;
  border: 1px solid black;
  border-radius: 50%;

  min-width: 30px;
  min-height: 30px;
  cursor: pointer;
`;

export const Content = styled.div`
  overflow-y: auto;
  height: calc(100% - 90px);
`;

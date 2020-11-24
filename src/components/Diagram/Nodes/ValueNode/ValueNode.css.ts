import styled from 'styled-components';

type ContentProps = {
  $small: boolean;
  $open: boolean;
};

type CollapseButtonProps = {
  $small: boolean;
  $open: boolean;
  $color: string;
};

export const Container = styled.div`
  position: relative;
`;

export const ErrorContainer = styled.div`
  font-family: monospace;
  color: black;
  width: 500px;

  h2 {
    font-size: 1.2em;
    margin-top: 24px;
    margin-bottom: 4px;
  }
`;

export const ErrorMessage = styled.div`
  background: #e6e6e6;
  border-left: 4px solid #d2d2d2;
  padding: 8px;
  white-space: pre-wrap;
  font-style: italic;
  color: #f23333;
`;

export const ErrorHint = styled.div`
  background: #e6e6e6;
  border-left: 4px solid #d2d2d2;
  padding: 8px;
  white-space: pre-wrap;
  max-width: fit-content;
  font-style: italic;
  margin-bottom: 16px;
`;

export const ErrorHintExample = styled.div`
  background: #fbfbfb;
  border-left: 4px solid #e2e2e2;
  border-radius: 5px;
  padding: 8px;
  white-space: pre-wrap;
  margin: 16px 0;
`;

export const ErrorHintComment = styled.span`
  color: #6a737d;
`;

export const ErrorHintBadExample = styled.span`
  background: #ffeef0;
  color: red;
`;

export const ErrorHintGoodExample = styled.span`
  background: #e6ffed;
  color: green;
`;

export const Content = styled.div<ContentProps>`
  background: white;
  border: 2px solid white;

  display: flex;
  align-items: center;
  justify-content: center;

  min-width: ${({ $small }) => ($small ? 36 : 70)}px;
  min-height: ${({ $small }) => ($small ? 36 : 70)}px;
  max-width: ${({ $open, $small }) =>
    $open ? 1000 : $small ? 36 : 70}px;
  max-height: ${({ $open, $small }) =>
    $open ? 1000 : $small ? 36 : 70}px;

  border-radius: ${({ $open }) => ($open ? '20px' : '50%')};
  padding: ${({ $open }) => ($open ? '20px' : '0')};
  overflow: hidden;

  transition: 500ms ease-in-out;

  .value-display,
  ${ErrorContainer} {
    transition: 500ms ease-in-out;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transform: ${({ $open }) => `scale(${$open ? '1, 1' : '0, 0'})`};
    pointer-events: ${({ $open }) => ($open ? 'all' : 'none')};
  }

  .react-json-view {
    margin-right: 20px;

    & > * {
      white-space: nowrap;
    }
  }
`;

export const CollapseButton = styled.button<CollapseButtonProps>`
  position: absolute;
  top: ${({ $open }) => ($open ? '0' : '50%')};
  right: ${({ $open }) => ($open ? '0' : '50%')};
  transform: ${({ $open }) =>
    `translate(${$open ? '30%, -30%' : '50%, -50%'})`};

  width: ${({ $open, $small }) => ($open ? 32 : $small ? 30 : 60)}px;
  height: ${({ $open, $small }) => ($open ? 32 : $small ? 30 : 60)}px;

  display: flex;
  align-items: center;
  justify-content: center;
  line-height: ${({ $open, $small }) =>
    $open ? 32 : $small ? 30 : 60}px;

  background: ${({ $open }) => ($open ? 'white' : 'none')};
  border: ${({ $open, $small, $color }) =>
    $open
      ? `2px solid #cc1d1d`
      : `${$small ? 2 : 4}px solid ${$color}`};
  border-radius: 50%;
  box-shadow: ${({ $open }) => ($open ? '0 0 0 2px white' : 'none')};
  outline: none;
  cursor: pointer;

  font-family: monospace;
  font-size: ${({ $open, $small }) =>
    $open ? 12 : $small ? 35 : 64}px;
  color: ${({ $open, $color }) => ($open ? '#cc1d1d' : $color)};

  transition: 300ms ease-in-out;
`;

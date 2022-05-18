import styled from 'styled-components';

type ContentProps = {
  $open?: boolean;
  $color: [string, string];
};

type CollapsableContentProps = {
  $open?: boolean;
};

type ExtraButtonProps = {
  $color: string;
  $tooltip: string;
};

export const Container = styled.div`
  position: relative;
`;

export const Content = styled.div<ContentProps>`
  font-family: monospace;
  background: ${({ $color }) =>
    `linear-gradient(90deg, ${$color[0]} 50%, ${$color[1]} 50%)`};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: ${({ $open }) => ($open ? '450px' : '150px')};
  min-height: 70px;
  max-height: ${({ $open }) => ($open ? '1000px' : '70px')};
  max-width: 450px;

  border-radius: ${({ $open }) => ($open ? '20px' : '35px')};
  overflow: hidden;
  cursor: pointer;

  transition: 300ms ease-in-out;
`;

export const CollapsableContent = styled.div<CollapsableContentProps>`
  background: #ffffffdb;
  color: black;

  width: ${({ $open }) => ($open ? '100%' : 0)};
  height: ${({ $open }) => ($open ? '100%' : 0)};
  max-height: ${({ $open }) => ($open ? '1000px' : 0)};
  max-width: ${({ $open }) => ($open ? '1000px' : 0)};

  transform: ${({ $open }) => `scale(${$open ? '1, 1' : '0, 0'})`};
  opacity: ${({ $open }) => ($open ? 1 : 0)};

  border-top: 1px solid #586e75;
  padding: ${({ $open }) => ($open ? '20px' : 0)};

  transition: 500ms ease-in-out;
`;

export const MethodTitle = styled.span`
  text-shadow: 2px 2px 4px black;
  font-size: 18px;
  color: white;
  line-height: 70px;
  padding: 0 32px;
`;

export const SectionTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  line-height: 2em;

  & > a {
    color: black;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Documentation = styled.div`
  background: #e6e6e6;
  border-left: 4px solid #d2d2d2;
  padding: 8px;
  white-space: pre-wrap;
  max-width: fit-content;
  font-style: italic;
  margin-bottom: 16px;
`;

export const Code = styled.div`
  background: #bdbdbd;
  border-left: 4px solid #7c7c7c;
  border-radius: 5px;
  padding: 8px;
  white-space: pre-wrap;
`;

export const ExtraButtonsContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(calc(100% + 16px));

  display: flex;
  flex-direction: column;

  & > button {
    margin-top: 15px;
    &:first-child {
      margin-top: 0;
    }
  }
`;

export const ExtraButton = styled.button<ExtraButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;

  background: #393939;
  border: ${({ $color }) => `2px inset ${$color}`};
  border-radius: 50%;
  color: ${({ $color }) => $color};

  width: 32px;
  height: 32px;

  outline: none;
  cursor: pointer;

  &:hover:after {
    content: ${({ $tooltip }) => `'${$tooltip}'`};
    position: absolute;
    right: 0;
    transform: translateX(calc(100% + 8px));
    font-family: monospace;
    font-style: italic;
    white-space: nowrap;
  }
`;

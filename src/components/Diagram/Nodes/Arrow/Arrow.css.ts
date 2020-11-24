import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

export const Circle = styled.div`
  border: 2px solid #ffffffcc;
  min-width: 12px;
  min-height: 12px;
  border-radius: 50%;
  margin-top: -6px;
`;

export const Shaft = styled.div`
  min-width: 3px;
  min-height: 50px;
  background: #ffffffcc;
`;

export const Tip = styled.div`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 14px solid #ffffffcc;
`;

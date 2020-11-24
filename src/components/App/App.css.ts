import BaseSplitPane from 'react-split-pane';

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  user-select: none;
`;

export const SplitPane = styled(BaseSplitPane)`
  .Resizer {
    background: white;
    background-clip: padding-box;
    border-left: 5px solid rgba(255, 255, 255, 0.3);
    border-right: 5px solid rgba(255, 255, 255, 0.3);

    z-index: 1;
    opacity: 0.5;
    width: 11px;
    margin: 0 -5px;
    cursor: col-resize;
    transition: 500ms ease;

    &.disabled {
      display: none;
    }

    &:hover {
      border-left: 5px solid rgba(255, 255, 255, 0.8);
      border-right: 5px solid rgba(255, 255, 255, 0.8);
    }
  }

  .Pane1 {
    overflow-y: auto;
  }
`;

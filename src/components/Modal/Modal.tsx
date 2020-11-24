import React, { useRef } from 'react';
import ReactDOM from 'react-dom';

import { ReactComponent as Close } from 'src/assets/close.svg';

import {
  Backdrop,
  Window,
  Title,
  CloseButton,
  Content,
} from './Modal.css';

const target = document.getElementById('root');

type ModalProps = {
  title: string;
  visible: boolean;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  visible,
  onClose,
}) => {
  const backdropRef = useRef(null);

  if (!target) return null;

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target !== backdropRef.current) return;
    onClose();
  };

  const preventDiagramMove = (
    event:
      | React.MouseEvent<HTMLElement>
      | React.TouchEvent<HTMLElement>,
  ) => event.stopPropagation();

  return ReactDOM.createPortal(
    <Backdrop
      onClick={handleClose}
      $visible={visible}
      ref={backdropRef}
      onMouseMove={preventDiagramMove}
      onTouchMove={preventDiagramMove}
    >
      <Window>
        <Title>
          <h1>{title}</h1>
          <CloseButton onClick={onClose}>
            <Close width={15} height={15} />
          </CloseButton>
        </Title>
        <Content>{children}</Content>
      </Window>
    </Backdrop>,
    target,
  );
};

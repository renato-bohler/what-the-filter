import React from 'react';

import { Modal } from 'src/components/Modal/Modal';

type WarningsModalProps = {
  visible: boolean;
  onClose: () => void;
  warnings: string[];
};

export const WarningsModal: React.FC<WarningsModalProps> = ({
  visible,
  onClose,
  warnings,
}) => (
  <Modal title="Warnings" visible={visible} onClose={onClose}>
    <ol>
      {warnings.map((warning) => (
        <li key={warning}>{warning}</li>
      ))}
    </ol>
  </Modal>
);

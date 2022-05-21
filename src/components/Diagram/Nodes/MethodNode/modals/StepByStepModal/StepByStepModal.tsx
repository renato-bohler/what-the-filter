import React, { useState } from 'react';

import { ValueDisplay } from 'src/components/Diagram/Nodes/ValueDisplay/ValueDisplay';
import { Modal } from 'src/components/Modal/Modal';
import {
  ExecutionSteps,
  FilterMapExecutionSteps,
  ReduceExecutionSteps,
  Value,
} from 'src/execute/utils/types';

import {
  CheckboxContainer,
  Code,
  Subtitle,
  Table,
} from './StepByStepModal.css';

type StepByStepModalProps = {
  visible: boolean;
  onClose: () => void;
  executionSteps: ExecutionSteps[];
  code: string;
  input: Value;
  output: Value;
};

type StepTableProps = {
  executionSteps: ExecutionSteps[];
  showAllColumns: boolean;
};

const isReduce = (
  step: ExecutionSteps[],
): step is ReduceExecutionSteps[] =>
  (step as ReduceExecutionSteps[])[0].accumulator !== undefined;
const isFilterMap = (
  step: ExecutionSteps[],
): step is FilterMapExecutionSteps[] =>
  (step as FilterMapExecutionSteps[])[0].input !== undefined;

const StepTable: React.FC<StepTableProps> = ({
  executionSteps,
  showAllColumns,
}) => {
  if (isReduce(executionSteps)) {
    return (
      <Table>
        <thead>
          <tr>
            <th>accumulator</th>
            <th>current</th>
            {showAllColumns && (
              <>
                <th>index</th>
                <th>array</th>
              </>
            )}
            <th>output</th>
          </tr>
        </thead>
        <tbody>
          {executionSteps.map((step) => (
            <tr key={step.index}>
              <td>
                <ValueDisplay value={step.accumulator} collapsed />
              </td>
              <td>
                <ValueDisplay value={step.current} collapsed />
              </td>
              {showAllColumns && (
                <>
                  <td>
                    <ValueDisplay value={step.index} collapsed />
                  </td>
                  <td>
                    <ValueDisplay value={step.array} collapsed />
                  </td>
                </>
              )}
              <td>
                <ValueDisplay value={step.output} collapsed />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (isFilterMap(executionSteps)) {
    return (
      <Table>
        <thead>
          <tr>
            <th>input</th>
            {showAllColumns && (
              <>
                <th>index</th>
                <th>array</th>
              </>
            )}
            <th>output</th>
          </tr>
        </thead>
        <tbody>
          {executionSteps.map((step) => (
            <tr key={step.index}>
              <td>
                <ValueDisplay value={step.input} collapsed />
              </td>
              {showAllColumns && (
                <>
                  <td>
                    <ValueDisplay value={step.index} collapsed />
                  </td>
                  <td>
                    <ValueDisplay value={step.array} collapsed />
                  </td>
                </>
              )}
              <td>
                <ValueDisplay value={step.output} collapsed />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return null;
};

export const StepByStepModal: React.FC<StepByStepModalProps> = ({
  visible,
  onClose,
  executionSteps,
  code,
  input,
  output,
}) => {
  const [showAllColumns, setShowAllColumns] = useState(false);

  return (
    <Modal
      title="Step by step execution"
      visible={visible}
      onClose={onClose}
    >
      <Subtitle>Input</Subtitle>
      <ValueDisplay value={input} collapsed />

      <Subtitle>Code</Subtitle>
      <Code>{code}</Code>

      <Subtitle>Execution detail</Subtitle>
      <CheckboxContainer>
        <label>
          show index / array
          <input
            id="showAllColumns"
            name="showAllColumns"
            type="checkbox"
            checked={showAllColumns}
            onChange={() => setShowAllColumns(!showAllColumns)}
          />
        </label>
      </CheckboxContainer>
      <StepTable
        executionSteps={executionSteps}
        showAllColumns={showAllColumns}
      />

      <Subtitle>Output</Subtitle>
      <ValueDisplay value={output} collapsed />
    </Modal>
  );
};

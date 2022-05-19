import React, { useState } from 'react';

import prettier from 'prettier';
import parser from 'prettier/parser-babel';

import { ReactComponent as ExternalLink } from 'src/assets/external-link.svg';
import { ReactComponent as Steps } from 'src/assets/steps.svg';
import { ReactComponent as Warning } from 'src/assets/warning.svg';
import { Step } from 'src/execute/utils/types';

import { MDN_DOCS } from './docs.const';
import {
  Code,
  CollapsableContent,
  Container,
  Content,
  Documentation,
  MethodTitle,
  SectionTitle,
  ExtraButtonsContainer,
  ExtraButton,
} from './MethodNode.css';
import { StepByStepModal } from './modals/StepByStepModal/StepByStepModal';
import { WarningsModal } from './modals/WarningsModal/WarningsModal';

type Props = {
  step: Step;
  open: boolean;
  toggleOpen: () => void;
};

const COLORS: [string, string][] = [
  ['#ce7318', '#f7b680'],
  ['#b66514', '#f57a37'],
  ['#f34e1e', '#ff7261'],
  ['#ef1a2e', '#e88c97'],
  ['#9c2739', '#ce4348'],
  ['#a259ff', '#ec87fa'],
  ['#00698c', '#00aee8'],
  ['#4d60ac', '#4c81c3'],
  ['#0bcf83', '#77f78d'],
  ['#188d70', '#64c39b'],
  ['#00a2b1', '#5cc4c3'],
];

const getRandomColor: () => [string, string] = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};

const getFormattedCode = (step: Step) =>
  `${prettier
    .format(
      `${step.method.includes('.') ? 'a' : 'a.'}${
        step.method
      }(${step.arguments.join(', ')})`,
      {
        parser: 'babel',
        plugins: [parser],
        printWidth: 40,
        semi: false,
      },
    )
    .substring(1)}`;

export const MethodNode: React.FC<Props> = ({
  step,
  open,
  toggleOpen,
}) => {
  const [color] = useState(getRandomColor());
  const [code] = useState(getFormattedCode(step));
  const [isStepByStepVisible, setStepByStepVisible] = useState(false);
  const [isWarningsVisible, setWarningsVisible] = useState(false);
  const [documentation] = useState(MDN_DOCS[step.method]);

  return (
    <>
      <Container>
        <Content $open={open} $color={color} onMouseUp={toggleOpen}>
          <MethodTitle>{step.method}</MethodTitle>
          <CollapsableContent $open={open}>
            <SectionTitle>Code:</SectionTitle>
            <Code>{code}</Code>

            {documentation?.url && (
              <>
                <br />
                <SectionTitle>
                  <a
                    href={documentation.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    onMouseUp={(event) => event.stopPropagation()}
                  >
                    MDN docs: <ExternalLink width={16} height={16} />
                  </a>
                </SectionTitle>

                <Documentation>
                  {documentation.description}
                </Documentation>
              </>
            )}
          </CollapsableContent>
        </Content>

        <ExtraButtonsContainer>
          {step.executionSteps && step.executionSteps.length > 0 && (
            <>
              <ExtraButton
                $color="#d01a83"
                $tooltip="Step by step"
                onClick={() => setStepByStepVisible(true)}
              >
                <Steps width={20} height={20} />
              </ExtraButton>
              <StepByStepModal
                visible={isStepByStepVisible}
                onClose={() => setStepByStepVisible(false)}
                executionSteps={step.executionSteps}
                code={code}
                input={step.input}
                output={step.output}
              />
            </>
          )}
          {step.warnings && step.warnings.length > 0 && (
            <>
              <ExtraButton
                $color="#ffb217"
                $tooltip="Warnings"
                onClick={() => setWarningsVisible(true)}
              >
                <Warning width={20} height={20} />
              </ExtraButton>
              <WarningsModal
                visible={isWarningsVisible}
                onClose={() => setWarningsVisible(false)}
                warnings={step.warnings}
              />
            </>
          )}
        </ExtraButtonsContainer>
      </Container>
    </>
  );
};

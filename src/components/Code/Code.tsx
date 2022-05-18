import React, { useRef, useState, useEffect } from 'react';
import { ValueType } from 'react-select';

import useHotkeys from '@reecelucas/react-use-hotkeys';

import { ReactComponent as FullscreenEnter } from 'src/assets/fullscreen-enter.svg';
import { ReactComponent as FullscreenExit } from 'src/assets/fullscreen-exit.svg';

import {
  Container,
  Description,
  Select,
  Editor,
  Loading,
  Button,
  EditorWrapper,
  IconButton,
} from './Code.css';
import { EXAMPLES, Example } from './examples.const';

type CodeProps = {
  onSubmit: (value: string) => void;
  width?: number;
  submitOnMount?: boolean;
};

type ValueGetter = () => string;

export const Code: React.VFC<CodeProps> = ({
  onSubmit,
  width,
  submitOnMount,
}) => {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [fullscreen, setFullscreen] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [selectedExample, setSelectedExample] = useState<Example>(
    EXAMPLES[0].options[0],
  );

  const handleHotKey = (event: KeyboardEvent) => {
    event.preventDefault();
    handleSubmit();
  };
  useHotkeys(['Control+s', 'Shift+Enter'], handleHotKey);

  const handleToggleFullscreen = () => setFullscreen((f) => !f);

  // We need this so that Monaco can recalculate its height
  useEffect(() => {
    if (fullscreen) return;
    setHeight(0);
    setTimeout(() => setHeight(undefined), 100);
  }, [fullscreen]);

  const handleExampleChange = (selected: ValueType<Example>) => {
    if (!selected) return;
    const option = selected as Example;
    setSelectedExample(option);
    onSubmit(option.value);
  };

  const valueGetter = useRef<ValueGetter>();
  const handleEditorDidMount = (getValue: ValueGetter) => {
    valueGetter.current = getValue;
    setIsEditorReady(true);
    if (submitOnMount) handleSubmit();
  };
  const getCurrentValue = () => {
    if (!valueGetter.current) return '';
    return valueGetter.current();
  };

  const handleSubmit = () => onSubmit(getCurrentValue());

  return (
    <Container>
      <Description>Select an example below...</Description>
      <Select
        value={selectedExample}
        onChange={handleExampleChange}
        options={EXAMPLES}
        classNamePrefix="select"
      />

      <Description>... and edit as you will</Description>

      <EditorWrapper $fullscreen={fullscreen} $width={width}>
        <IconButton
          onClick={handleToggleFullscreen}
          title={fullscreen ? 'Contract editor' : 'Expand editor'}
        >
          {fullscreen ? <FullscreenExit /> : <FullscreenEnter />}
        </IconButton>

        <Editor
          theme="vs-dark"
          language="javascript"
          options={{
            minimap: {
              enabled: false,
            },
          }}
          editorDidMount={handleEditorDidMount}
          value={selectedExample.value}
          loading={<Loading>Loading code editor...</Loading>}
          width={width}
          height={height}
          $fullscreen={fullscreen}
        />
      </EditorWrapper>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!isEditorReady}
      >
        Execute
      </Button>
      <Description>
        (you can also CTRL + S or SHIFT + ENTER)
      </Description>
    </Container>
  );
};

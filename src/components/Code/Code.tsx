import React, { useState, useEffect } from 'react';
import { SingleValue } from 'react-select';

import useHotkeys from '@reecelucas/react-use-hotkeys';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

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

type EditorInstance = monaco.editor.IStandaloneCodeEditor;

export const Code: React.FC<CodeProps> = ({
  onSubmit,
  width,
  submitOnMount,
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<Example>(
    EXAMPLES[0].options[0],
  );

  useEffect(() => {
    setEditorValue(selectedExample.value);
  }, [selectedExample]);

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

  const handleExampleChange = (selected: SingleValue<Example>) => {
    if (!selected) return;
    const option = selected as Example;
    setSelectedExample(option);
    onSubmit(option.value);
  };

  const handleEditorDidMount = (editor: EditorInstance) => {
    setIsEditorReady(true);
    if (submitOnMount) handleSubmit(editor.getValue());
  };

  const handleEditorChange = (value?: string) => {
    setEditorValue(value || '');
  };

  const handleSubmit = (value: string = editorValue) =>
    onSubmit(value);

  return (
    <Container>
      <Description>Select an example below...</Description>
      <Select<Example, false>
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
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          value={editorValue}
          loading={<Loading>Loading code editor...</Loading>}
          width={width}
          height={height}
          $fullscreen={fullscreen}
        />
      </EditorWrapper>

      <Button
        type="button"
        onClick={() => handleSubmit()}
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

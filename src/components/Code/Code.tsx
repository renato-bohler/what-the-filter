import React, { useEffect, useState } from 'react';

import useHotkeys from '@reecelucas/react-use-hotkeys';
import { decompressFromEncodedURIComponent } from 'lz-string';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import GitHubButton from 'react-github-button';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import { ReactComponent as FullscreenEnter } from 'src/assets/fullscreen-enter.svg';
import { ReactComponent as FullscreenExit } from 'src/assets/fullscreen-exit.svg';

import {
  Button,
  Container,
  Description,
  Editor,
  EditorFooter,
  EditorMenuBar,
  EditorWrapper,
  FooterLink,
  IconButton,
  Loading,
  MenuBarButton,
  MenuBarButtonContainer,
  Select,
} from './Code.css';
import { Example, EXAMPLES } from './examples.const';

type CodeProps = {
  onSubmit: (value: string, auto?: boolean) => void;
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
    if (location.hash.startsWith('#code')) {
      const compressedCode = location.hash
        .replace('#code/', '')
        .trim();
      console.log('compressedCode:', compressedCode);
      const code = decompressFromEncodedURIComponent(compressedCode);

      if (code) {
        setEditorValue(code);
        setFullscreen(true);
      } else {
        setEditorValue(selectedExample.value);
        toast('Failed parsing shared URL');
      }
    } else {
      setEditorValue(selectedExample.value);
    }
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
    onSubmit(option.value, true);
  };

  const handleEditorDidMount = (editor: EditorInstance) => {
    setIsEditorReady(true);
    if (submitOnMount) onSubmit(editor.getValue(), true);
  };

  const handleEditorChange = (value?: string) => {
    setEditorValue(value || '');
  };

  const handleSubmit = () => {
    onSubmit(editorValue);
  };

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

      <EditorWrapper $fullscreen={fullscreen} style={{ width }}>
        <EditorMenuBar $fullscreen={fullscreen}>
          what the filter?
          <MenuBarButtonContainer>
            <MenuBarButton onClick={handleSubmit} title="CTRL + S">
              Execute
            </MenuBarButton>
          </MenuBarButtonContainer>
        </EditorMenuBar>

        <IconButton
          onClick={handleToggleFullscreen}
          title={fullscreen ? 'Contract editor' : 'Expand editor'}
          $fullscreen={fullscreen}
        >
          {fullscreen ? <FullscreenExit /> : <FullscreenEnter />}
        </IconButton>

        <EditorFooter $fullscreen={fullscreen}>
          <span>
            Made by{' '}
            <FooterLink
              href="https://renato-bohler.github.io/"
              rel="noopener noreferrer"
            >
              Renato Böhler
            </FooterLink>
          </span>

          <GitHubButton
            type="stargazers"
            namespace="renato-bohler"
            repo="what-the-filter"
          />
        </EditorFooter>

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

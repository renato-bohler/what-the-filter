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
import { CUSTOM_OPTION, Example, EXAMPLES } from './examples.const';

type CodeProps = {
  onSubmit: (value: string, auto?: boolean) => void;
  width?: number;
  submitOnMount?: boolean;
};

type EditorInstance = monaco.editor.IStandaloneCodeEditor;

const IS_SHAREABLE_URL = location.hash.startsWith('#code');

export const Code: React.FC<CodeProps> = ({
  onSubmit,
  width,
  submitOnMount,
}) => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<Example>(
    EXAMPLES[0].options[0],
  );

  useEffect(() => {
    setEditorValue(selectedExample.value);
    setIsCustom(false);
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

  const initializeEditorValue = () => {
    if (!IS_SHAREABLE_URL) return;

    const compressedCode = location.hash.replace('#code/', '').trim();
    const code = decompressFromEncodedURIComponent(compressedCode);

    if (code) {
      setEditorValue(code);
      setFullscreen(true);
      setIsCustom(true);
      onSubmit(code, true);
    } else {
      setEditorValue(selectedExample.value);
      toast('Failed parsing shared URL');
    }
  };

  const handleEditorDidMount = (editor: EditorInstance) => {
    setIsEditorReady(true);
    initializeEditorValue();
    if (!IS_SHAREABLE_URL && submitOnMount)
      onSubmit(editor.getValue(), true);
  };

  const handleEditorChange = (value?: string) => {
    setEditorValue(value || '');
    setIsCustom(true);
  };

  const handleSubmit = () => {
    onSubmit(editorValue);
  };

  const handleShare = () => {
    const input = document.createElement('input');
    input.value = window.location.href;
    input.setSelectionRange(0, input.value.length);
    navigator.clipboard.writeText(input.value);

    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000);
  };

  return (
    <Container>
      <Description>Select an example below...</Description>
      <Select<Example, false>
        value={isCustom ? CUSTOM_OPTION.options[0] : selectedExample}
        onChange={handleExampleChange}
        options={isCustom ? [...EXAMPLES, CUSTOM_OPTION] : EXAMPLES}
        classNamePrefix="select"
      />

      <Description>... and edit as you will</Description>

      <EditorWrapper $fullscreen={fullscreen} style={{ width }}>
        <EditorMenuBar $fullscreen={fullscreen}>
          what the filter?
          <MenuBarButtonContainer>
            {showCopiedMessage && (
              <span
                style={{ fontFamily: 'monospace', marginRight: 16 }}
              >
                Copied URL to clipboard!
              </span>
            )}
            <MenuBarButton
              onClick={handleShare}
              style={{ background: '#363636' }}
            >
              Share
            </MenuBarButton>
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

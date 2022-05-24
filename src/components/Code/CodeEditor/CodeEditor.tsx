import React, { useEffect, useState } from 'react';

import useHotkeys from '@reecelucas/react-use-hotkeys';
import { decompressFromEncodedURIComponent } from 'lz-string';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import GitHubButton from 'react-github-button';
import { toast } from 'react-toastify';

import { ReactComponent as FullscreenEnter } from 'src/assets/fullscreen-enter.svg';
import { ReactComponent as FullscreenExit } from 'src/assets/fullscreen-exit.svg';

import {
  Button,
  Container,
  Footer,
  FooterLink,
  IconButton,
  Loading,
  MenuBar,
  MenuBarButton,
  MenuBarButtonContainer,
  MonacoEditor,
} from './CodeEditor.css';

type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  setIsCustom: (value: boolean) => void;
  onSubmit: (value: string, auto?: boolean) => void;
  submitOnMount?: boolean;
  width?: number;
};

type EditorInstance = monaco.editor.IStandaloneCodeEditor;

const IS_SHAREABLE_URL = location.hash.startsWith('#code');

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onSubmit,
  setIsCustom,
  submitOnMount,
  width,
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [fullscreen, setFullscreen] = useState(false);

  const handleHotKey = (event: KeyboardEvent) => {
    event.preventDefault();
    handleSubmit();
  };
  useHotkeys(['Control+s', 'Shift+Enter'], handleHotKey);

  const handleEditorDidMount = (editor: EditorInstance) => {
    setIsEditorReady(true);
    initializeEditorValue();
    if (!IS_SHAREABLE_URL && submitOnMount)
      onSubmit(editor.getValue(), true);
  };

  const handleToggleFullscreen = () => setFullscreen((f) => !f);

  const initializeEditorValue = () => {
    if (!IS_SHAREABLE_URL) return;

    const compressedCode = location.hash.replace('#code/', '').trim();
    const code = decompressFromEncodedURIComponent(compressedCode);

    if (code) {
      onChange(code);
      setFullscreen(true);
      setIsCustom(true);
      onSubmit(code, true);
    } else {
      onChange('');
      toast('Failed parsing shared URL');
    }
  };

  const handleEditorChange = (newValue?: string) => {
    onChange(newValue || '');
    setIsCustom(true);
  };

  const handleSubmit = () => {
    onSubmit(value);
  };

  const handleShare = () => {
    const input = document.createElement('input');
    input.value = window.location.href;
    input.setSelectionRange(0, input.value.length);
    navigator.clipboard.writeText(input.value);

    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000);
  };

  // We need this so that Monaco can recalculate its height
  useEffect(() => {
    if (fullscreen) return;
    setHeight(0);
    setTimeout(() => setHeight(undefined), 100);
  }, [fullscreen]);

  return (
    <>
      <Container $fullscreen={fullscreen} style={{ width }}>
        <MenuBar $fullscreen={fullscreen}>
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
        </MenuBar>

        <IconButton
          onClick={handleToggleFullscreen}
          title={fullscreen ? 'Contract editor' : 'Expand editor'}
          $fullscreen={fullscreen}
        >
          {fullscreen ? <FullscreenExit /> : <FullscreenEnter />}
        </IconButton>

        <Footer $fullscreen={fullscreen}>
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
        </Footer>

        <MonacoEditor
          theme="vs-dark"
          language="javascript"
          options={{
            minimap: {
              enabled: false,
            },
          }}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          value={value}
          loading={<Loading>Loading code editor...</Loading>}
          width={width}
          height={height}
          $fullscreen={fullscreen}
        />
      </Container>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!isEditorReady}
      >
        Execute
      </Button>
    </>
  );
};

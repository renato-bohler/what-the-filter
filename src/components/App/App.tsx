import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { v4 as uuidv4 } from 'uuid';

import { Code } from 'src/components/Code/Code';
import { Diagram, DiagramNode } from 'src/components/Diagram/Diagram';
import { Footer } from 'src/components/Footer/Footer';
import { Header } from 'src/components/Header/Header';
import { execute } from 'src/execute/execute';
import { Result } from 'src/execute/utils/types';

import { Container, SplitPane } from './App.css';

import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_PANE_SIZE = () => Math.max(400, window.innerWidth / 2);

const generateNodesFromSource = (source: Result): DiagramNode[] => [
  {
    id: uuidv4(),
    step: source.steps[0],
    open: false,
    type: 'start',
  },
  ...source.steps
    .map((step, index) => [
      {
        id: uuidv4(),
        step,
        open: false,
        type: 'method' as const,
      },
      ...(index !== source.steps.length - 1
        ? [
            {
              id: uuidv4(),
              step,
              open: false,
              type: 'value' as const,
            },
          ]
        : []),
    ])
    .flat(),
  {
    id: uuidv4(),
    step: source.steps[source.steps.length - 1],
    open: false,
    type: source.error === null ? 'success' : 'error',
    error: source.error,
  },
];

export const App: React.VFC = () => {
  const [isDiagramOpen, setDiagramOpen] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [paneSize, setPaneSize] = useState(DEFAULT_PANE_SIZE);
  const [diagramNodes, setDiagramNodes] = useState<DiagramNode[]>([]);

  const isTouchDevice = window.matchMedia(
    '(hover: none) and (pointer: coarse)',
  ).matches;

  const handleWindowResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () =>
      window.removeEventListener('resize', handleWindowResize);
  }, []);

  const handleCodeSubmit = (code: string) => {
    setDiagramNodes([]);

    setTimeout(() => {
      try {
        const source = execute(code);

        if (source.steps.length === 0)
          throw new Error('Empty result');

        setDiagramNodes(generateNodesFromSource(source));
        setDiagramOpen(true);
        if (paneSize === 0) setPaneSize(DEFAULT_PANE_SIZE);
      } catch (error) {
        toast(error.message, {
          type: 'error',
          position: 'bottom-left',
        });
      }
    });
  };

  const handleCloseDiagram = () => {
    setDiagramOpen(false);
    setPaneSize(0);
  };
  const handlePaneResize = (size: number) => setPaneSize(size);
  const handleToggleAllDiagramValues = (open: boolean) =>
    setDiagramNodes((nodes) =>
      nodes.map((node) => {
        if (node.type === 'method') return node;
        return { ...node, open };
      }),
    );

  const handleToggleDiagramNode = (toggleNode: DiagramNode) =>
    setDiagramNodes((nodes: DiagramNode[]) =>
      nodes.map((node) => {
        if (node.id !== toggleNode.id) return node;
        return { ...node, open: !node.open };
      }),
    );

  if (isTouchDevice)
    return (
      <Container>
        <Header />
        <Code onSubmit={handleCodeSubmit} width={width - 50} />
        <Diagram
          isOpen={isDiagramOpen}
          onClose={handleCloseDiagram}
          nodes={diagramNodes}
          toggleNode={handleToggleDiagramNode}
          toggleValues={handleToggleAllDiagramValues}
        />
        <Footer />
        <ToastContainer />
      </Container>
    );

  return (
    <SplitPane
      split="vertical"
      primary="second"
      minSize={500}
      maxSize={width - 500}
      allowResize={isDiagramOpen}
      onChange={handlePaneResize}
      size={paneSize}
    >
      <Container>
        <Header />
        <Code
          onSubmit={handleCodeSubmit}
          width={width - paneSize - 50}
          submitOnMount
        />
        <Footer />
        <ToastContainer />
      </Container>
      <Diagram
        isOpen={isDiagramOpen}
        onClose={handleCloseDiagram}
        nodes={diagramNodes}
        toggleNode={handleToggleDiagramNode}
        toggleValues={handleToggleAllDiagramValues}
      />
    </SplitPane>
  );
};

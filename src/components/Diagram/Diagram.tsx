import React, { Fragment, useEffect, useRef, useState } from 'react';

import { ResultError, Step } from 'src/execute/utils/types';

import {
  CloseButton,
  Container,
  NodesContainer,
  ToggleButton,
  ZoomButton,
  ZoomContainer,
  ZoomDivider,
} from './Diagram.css';
import { Arrow } from './Nodes/Arrow/Arrow';
import { MethodNode } from './Nodes/MethodNode/MethodNode';
import { ValueNode } from './Nodes/ValueNode/ValueNode';

type DiagramProps = {
  isOpen: boolean;
  onClose: () => void;
  nodes: DiagramNode[];
  toggleNode: (node: DiagramNode) => void;
  toggleValues: (open: boolean) => void;
};

export type DiagramNode = {
  id: string;
  step: Step;
  open: boolean;
  type: 'start' | 'method' | 'value' | 'success' | 'error';
  error?: ResultError | null;
};

type Position = {
  x: number;
  y: number;
};

export const Diagram: React.FC<DiagramProps> = ({
  isOpen,
  onClose,
  nodes,
  toggleNode,
  toggleValues,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [isMoving, setMoving] = useState(false);
  const [initialOffset, setInitialOffset] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [currentOffset, setCurrentOffset] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [isAllValuesOpened, setAllValuesOpened] = useState(false);

  /**
   * Generic drag event handlers
   */
  const handleDragStart = (initialPosition: Position) => {
    setDragging(true);
    setMoving(false);
    setInitialOffset({
      x: initialPosition.x - currentOffset.x,
      y: initialPosition.y - currentOffset.y,
    });
  };
  const handleDragMove = (currentPosition: Position) => {
    if (!isDragging) return;
    setMoving(true);
    setCurrentOffset({
      x: currentPosition.x - initialOffset.x,
      y: currentPosition.y - initialOffset.y,
    });
  };
  const handleDragEnd = () => {
    setDragging(false);
    setMoving(false);
  };

  /**
   * Mouse drag event handlers
   */
  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) =>
    handleDragStart({ x: event.clientX, y: event.clientY });
  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) =>
    handleDragMove({ x: event.clientX, y: event.clientY });
  const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    if (isMoving) event.stopPropagation();
    handleDragEnd();
  };

  /**
   * Touch drag event handlers
   */
  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) =>
    handleDragStart({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    });
  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) =>
    handleDragMove({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    });
  const handleTouchEnd = handleDragEnd;

  const handleReleaseAway = (event: MouseEvent) => {
    if (!ref.current) return;
    if (!event.target) return;
    if (!(event.target instanceof Element)) return;
    if (ref.current.contains(event.target)) return;

    setDragging(false);
  };

  const handleClickToggle = () => {
    toggleValues(!isAllValuesOpened);
    setAllValuesOpened((v) => !v);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleReleaseAway);
    return () =>
      document.removeEventListener('mouseup', handleReleaseAway);
  }, []);

  return (
    <Container
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUpCapture={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      $isOpen={isOpen}
      style={{
        backgroundPositionX: currentOffset.x,
        backgroundPositionY: currentOffset.y,
        backgroundSize: `${zoom * 45}px ${zoom * 45}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px) scale(${zoom})`,
          transformOrigin: 'left top',
        }}
      >
        <NodesContainer>
          {nodes.length > 0 ? (
            nodes.map((node) => {
              if (node.type === 'start')
                return (
                  <Fragment key={node.id}>
                    <span>Start</span>
                    <ValueNode
                      value={node.step.input}
                      open={node.open}
                      toggleOpen={() => toggleNode(node)}
                      type="dot"
                    />
                    <Arrow />
                  </Fragment>
                );

              if (node.type === 'method')
                return (
                  <MethodNode
                    key={node.id}
                    step={node.step}
                    open={node.open}
                    toggleOpen={() => toggleNode(node)}
                  />
                );

              if (node.type === 'value')
                return (
                  <Arrow
                    key={node.id}
                    value={node.step.output}
                    open={node.open}
                    toggleOpen={() => toggleNode(node)}
                  />
                );

              if (node.type === 'success' || node.type === 'error')
                return (
                  <Fragment key={node.id}>
                    <Arrow />
                    <ValueNode
                      value={node.step.output}
                      open={node.open}
                      toggleOpen={() => toggleNode(node)}
                      type={
                        node.type === 'success' ? 'check' : 'error'
                      }
                      error={node.error}
                    />
                    <span>End</span>
                    <small>({node.type})</small>
                  </Fragment>
                );
            })
          ) : (
            <span>Loading...</span>
          )}
        </NodesContainer>
      </div>
      <CloseButton type="button" onClick={onClose}>
        ✕
      </CloseButton>

      <ZoomContainer>
        <ZoomButton
          type="button"
          onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
        >
          +
        </ZoomButton>
        <ZoomDivider />
        <ZoomButton
          type="button"
          onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
        >
          −
        </ZoomButton>
      </ZoomContainer>

      <ToggleButton onClick={handleClickToggle}>
        {isAllValuesOpened ? 'Hide' : 'Show'} all values
      </ToggleButton>
    </Container>
  );
};

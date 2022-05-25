import React, { useEffect, useState } from 'react';

import { SingleValue } from 'react-select';

import { Container, Description, Select } from './Code.css';
import { CodeEditor } from './CodeEditor/CodeEditor';
import {
  CUSTOM_OPTION,
  CUSTOM_OPTION_GROUP,
  Example,
  EXAMPLES,
} from './examples.const';

type CodeProps = {
  onSubmit: (value: string, auto?: boolean) => void;
  width?: number;
  submitOnMount?: boolean;
};

export const Code: React.FC<CodeProps> = ({
  onSubmit,
  width,
  submitOnMount,
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [selectedExample, setSelectedExample] = useState<Example>(
    EXAMPLES[0].options[0],
  );

  useEffect(() => {
    if (isCustom) {
      setSelectedExample(CUSTOM_OPTION);
    } else {
      setEditorValue(selectedExample.value);
    }
  }, [isCustom, selectedExample]);

  const handleExampleChange = (selected: SingleValue<Example>) => {
    if (!selected) return;
    setIsCustom(false);
    setSelectedExample(selected);
    onSubmit(selected.value, true);
  };

  return (
    <Container>
      <Description>Select an example below...</Description>
      <Select<Example, false>
        value={selectedExample}
        onChange={handleExampleChange}
        options={
          isCustom ? [...EXAMPLES, CUSTOM_OPTION_GROUP] : EXAMPLES
        }
        classNamePrefix="select"
      />

      <Description>... and edit as you will</Description>

      <CodeEditor
        value={editorValue}
        onChange={setEditorValue}
        setIsCustom={setIsCustom}
        onSubmit={onSubmit}
        submitOnMount={submitOnMount}
        width={width}
      />
      <Description>
        (you can also CTRL + S or SHIFT + ENTER)
      </Description>
    </Container>
  );
};

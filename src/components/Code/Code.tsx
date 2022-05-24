import React, { useEffect, useState } from 'react';

import { SingleValue } from 'react-select';

import { Container, Description, Select } from './Code.css';
import { CodeEditor } from './CodeEditor/CodeEditor';
import { CUSTOM_OPTION, Example, EXAMPLES } from './examples.const';

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
    setEditorValue(selectedExample.value);
    setIsCustom(false);
  }, [selectedExample]);

  const handleExampleChange = (selected: SingleValue<Example>) => {
    if (!selected) return;
    const option = selected as Example;
    setSelectedExample(option);
    onSubmit(option.value, true);
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

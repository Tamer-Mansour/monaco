import React from "react";
import * as MonacoEditor from 'react-monaco-editor';

import { editor } from 'monaco-editor';
const IDE = () => {
  const options: editor.IStandaloneEditorConstructionOptions = {
    autoIndent: 'full',
    contextmenu: true,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: 'always',
    minimap: {
      enabled: true,
    },
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 18,
    },
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
  };
  return (
    <div>
      <MonacoEditor.default height="400" options={options} />
    </div>
  );
};

export default IDE;

import Editor from "@monaco-editor/react";
import React, { useRef, useState } from "react";

const IDE = () => {
  const editorRef = useRef<any>(null); // Use 'any' as the type for editorRef
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
  }

  function showValue() {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      alert(value);
    } else {
      alert("Editor is not available.");
    }
  }

  function captureConsoleLog() {
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      setConsoleOutput(prevOutput => prevOutput + args.join(" ") + "\n");
    };
  }

  function runCode() {
    if (editorRef.current) {
      const value = editorRef.current.getValue();

      try {
        setConsoleOutput(""); // Clear previous output
        captureConsoleLog();
        eval(value);
      } catch (error) {
        setConsoleOutput(String(error));
      }
    } else {
      alert("Editor is not available.");
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleInputSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inputValue) {
      console.log(inputValue);
      setInputValue("");
    }
  }

  return (
    <div>
      <div>
        <button onClick={showValue}>Show value</button>
        <button onClick={runCode}>Run</button>
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          onMount={handleEditorDidMount}
        />
      </div>
      <div>
        <h3>Console Output:</h3>
        <pre id="console">{consoleOutput}</pre>
        <form onSubmit={handleInputSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter value"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default IDE;

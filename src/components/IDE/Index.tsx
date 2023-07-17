import Editor from "@monaco-editor/react";
import React, { useRef, useState } from "react";
import axios from "axios";

const IDE = () => {
  const editorRef = useRef<any>(null); // Use 'any' as the type for editorRef
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const showValue = () => {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      alert(value);
    } else {
      alert("Editor is not available.");
    }
  };

  const captureConsoleLog = () => {
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      setConsoleOutput((prevOutput) => prevOutput + args.join(" ") + "\n");
    };
  };

  const runCode = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
  
      try {
        setConsoleOutput(""); // Clear previous output
        captureConsoleLog();
  
        const response = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: "javascript",
            version: "15.10.0",
            files: [
              {
                name: "main.js",
                content: code,
              },
            ],
            stdin: "",
            args: [],
          }
        );
  
        const result = response.data;
  
        // Process the result as needed
        console.log(result);
      } catch (error) { 
        setConsoleOutput(String(error));
      }
    } else {
      alert("Editor is not available.");
    }
  };
  

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue) {
      console.log(inputValue);
      setInputValue("");
    }
  };

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

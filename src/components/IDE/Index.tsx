import Editor from "@monaco-editor/react";
import React, { useRef, useState } from "react";
import axios from "axios";
import "./IDE.css";

const apiInstance = axios.create({
  baseURL: "http://localhost:2000/api/v2",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Headers": "Content-Type",
  },
});

const IDE = () => {
  const editorRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    console.log("dsdsdfsfsdffgffg")
    if (editorRef.current) {
      const code = editorRef.current.getValue();

      try {
        const response = await apiInstance.post("/execute", {
          language: "python",
          version: "3.9.4",
          files: [
            {
              name: "main.py",
              content: code,
            },
          ],
          stdin: inputValue,
          args: [], // No arguments needed for Python code execution
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        });

        const result = JSON.stringify(response.data);

        // Update the output value with the result
        setOutputValue(result);
      } catch (error) {
        // Handle error here
        console.error(error);
        setOutputValue("Error occurred during execution.");
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
      runCode(); // Run the code again with the user input
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleInputSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter your input"
          />
          <button type="submit">Submit</button>
        </form>
        <button onClick={runCode}>Run</button>
        <Editor
          height="50vh"
          defaultLanguage="python"
          defaultValue="# Add your Python code here"
          onMount={handleEditorDidMount}
        />
        <div>
          <h3>Output:</h3>
          <pre>{outputValue}</pre>
        </div>
      </div>
    </div>
  );
};

export default IDE;

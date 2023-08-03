import Editor from "@monaco-editor/react";
import React, { useRef, useState } from "react";
import axios from "axios";
import "./IDE.css";

const apiInstance = axios.create({
  baseURL: "http://localhost:8181/api/piston/",
});

const IDE = () => {
  const editorRef = useRef(null);
  const [outputValue, setOutputValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const runCode = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();

      // Split the user input by comma and join with newline characters
      const formattedInput = inputValue.split(',').join('\n');

      try {
        const response = await apiInstance.post("/execute", {
          language: "js",
          version: "15.10",
          files: [
            {
              name: "main.js", // This should be main.py
              content: code,
            },
          ],
          stdin: formattedInput, // Use the formatted input
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        });

        const { stdout, stderr } = response.data.run;

        // Format the output to be more readable
        const formattedOutput = stdout || stderr || "No output available";

        // Update the output value with the result
        setOutputValue(formattedOutput);
      } catch (error) {
        // Handle error here
        console.error(error);
        setOutputValue("Error occurred during execution.");
      }
    } else {
      alert("Editor is not available.");
    }
  };

  const handleRunCode = () => {
    runCode(); // Run the code when the "Run" button is clicked
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() !== "") {
      runCode(); // Run the code again with the updated user input
    }
  };

  return (
    <div>
      <div>
        <button onClick={handleRunCode}>Run</button>
        <Editor
          height="50vh"
          defaultLanguage="javascript"
          defaultValue="// Add your js code here"
          onMount={handleEditorDidMount}
          theme='vs-dark'
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

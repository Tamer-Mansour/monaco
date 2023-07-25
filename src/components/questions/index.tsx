import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Typography, TextField, Button } from "@mui/material";
import Editor from "@monaco-editor/react";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

const AddQuestion: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const editorRef = useRef<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    const fetchUser = async (userId: string) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/${userId}`
        );
        const fetchedUser = response.data;
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (storedUser) {
      const parsedUser: { message: string; user: User } =
        JSON.parse(storedUser);

      if (parsedUser.user && parsedUser.user._id) {
        fetchUser(parsedUser.user._id);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const question = {
      title,
      description,
      codeSnippet: editorRef.current.getValue(),
    };

    try {
      await axios.post("http://localhost:5000/questions", question);

      setTitle("");
      setDescription("");
      setCodeSnippet("");

      alert("Question created successfully");
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to create question. Please try again.");
    }
  };

  if (!user || user.role !== "Teacher") {
    return (
      <Typography variant="h6">
        You are not authorized to access this page.
      </Typography>
    );
  }

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
      setConsoleOutput((prevOutput) => prevOutput + args.join(" ") + "\n");
    };
  }

  function runCode() {
    if (editorRef.current) {
      const value = editorRef.current.getValue();

      try {
        setConsoleOutput(""); // Clear previous output
        captureConsoleLog();

        const startTime = performance.now();
        const result = eval(value);
        const endTime = performance.now();
        const runtime = endTime - startTime;

        setConsoleOutput((prevOutput) => prevOutput + `\nRuntime: ${runtime.toFixed(2)}ms\nResult: ${result}`);
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
      <Typography variant="h4">Add Question</Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            margin="normal"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <TextField
            margin="normal"
            label="Description"
            variant="outlined"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Typography margin="normal" variant="subtitle1">
            Code Snippet:
          </Typography>

          <button onClick={showValue}>Show value</button>
          <button onClick={runCode}>Run</button>
          <Editor
            height="200px"
            defaultLanguage="javascript"
            defaultValue="//write your code here"
            value={codeSnippet}
            onChange={(value: string | undefined) =>
              setCodeSnippet(value || "")
            }
            options={{
              minimap: {
                enabled: false,
              },
            }}
            onMount={(editor) => (editorRef.current = editor)}
          />
        </div>

        <div>
          <Typography>Console Output:</Typography>
          <pre id="console">{consoleOutput}</pre>
          <form onSubmit={handleInputSubmit}>
            <TextField
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter value"
            />
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </form>
        </div>

        <Button variant="contained" type="submit">
          Add Question
        </Button>
      </form>
    </div>
  );
};

export default AddQuestion;

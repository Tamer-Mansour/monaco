import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
    return <div>You are not authorized to access this page.</div>;
  }

  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="codeSnippet">Code Snippet:</label>
          <Editor
            height="200px"
            defaultLanguage="javascript"
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
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default AddQuestion;

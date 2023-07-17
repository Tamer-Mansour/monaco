import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { Editor, OnChange } from "@monaco-editor/react";
import axios from "axios";

interface Question {
  _id: string;
  title: string;
  description: string;
  codeSnippet: string;
}

interface Answer {
  _id: string;
  questionId: string;
  studentId: string;
  answer: string;
}

interface User {
  _id: string;
  role: string;
}

const AnswerQuestionPage: React.FC = () => {
  const [answer, setAnswer] = useState("");
  const { id } = useParams<{ id?: string }>(); // This is the ID for the question
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: { message: string; user: User } = JSON.parse(storedUser);

      if (parsedUser.user && parsedUser.user._id) {
        fetchUser(parsedUser.user._id);
        fetchQuestion(id);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestion = async (questionId?: string) => {
    if (questionId) {
      try {
        const response = await axios.get(`http://localhost:5000/questions/${questionId}`);
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    }
  };

  const handleAnswerChange: OnChange = (value, event) => {
    setAnswer(value || "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && user.role === "Student") {
      try {
        const answerData = {
          studentId: user._id,
          answer,
          codeSnippet: question?.codeSnippet,
        };

        const response = await axios.post(
          `http://localhost:5000/questions/${id}/answers`,
          answerData
        );

        console.log("Answer submitted successfully:", response.data);
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    } else {
      console.error("User is not authorized to answer the question");
    }
  };

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      {question ? (
        <div>
          <Typography variant="h2">{question.title}</Typography>
          <Typography variant="body1">{question.description}</Typography>
          <form onSubmit={handleSubmit}>
            <Editor
              height="50vh"
              defaultLanguage="javascript"
              defaultValue={question.codeSnippet}
              onChange={handleAnswerChange}
            />
            <Button variant="contained" type="submit">
              Submit Answer
            </Button>
          </form>
        </div>
      ) : (
        <Typography variant="body1">Loading question...</Typography>
      )}
    </div>
  );
};

export default AnswerQuestionPage;

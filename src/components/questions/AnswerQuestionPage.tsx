import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, TextField, Button } from "@mui/material";
import { Editor } from "@monaco-editor/react";

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
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    fetchUser();
    fetchQuestion();
  }, []);

  const fetchUser = async () => {
    console.log(id);

    try {
      const response = await axios.get("http://localhost:5000/user"); // Replace with the appropriate endpoint to fetch the user
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/questions/${id}`); // Replace with the appropriate endpoint to fetch the question
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const handleAnswerChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswer(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user && user.role === "student") {
      try {
        const response = await axios.post(
          `http://localhost:5000/questions/${id}/answers`,
          {
            answer,
            codeSnippet: question?.codeSnippet, // Pass the codeSnippet from the fetched question
            studentId: user._id, // Pass the student ID as part of the answer submission
          }
        );

        // Handle success and redirect to a success page or perform any other necessary actions
        console.log("Answer submitted successfully:", response.data);
      } catch (error) {
        console.error("Error submitting answer:", error);
      }
    } else {
      console.error("User is not authorized to answer the question");
    }
  };

  return (
    <div>
      {question ? (
        <div>
          <Typography variant="h2">{question.title}</Typography>
          <Typography variant="body1">{question.description}</Typography>
          {/* <Typography variant="body1">{question.codeSnippet}</Typography> */}
          
          <Editor
            height="50vh"
            defaultLanguage="javascript"
            defaultValue={question.codeSnippet}
          />
        </div>
      ) : (
        <Typography variant="body1">Loading question...</Typography>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Your Answer"
            multiline
            value={answer}
            onChange={handleAnswerChange}
          />

        </div>
        <Button variant="contained" type="submit">
          Submit Answer
        </Button>
      </form>
    </div>
  );
};

export default AnswerQuestionPage;

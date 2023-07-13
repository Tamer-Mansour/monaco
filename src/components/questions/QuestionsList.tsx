import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";

interface Question {
  _id: string;
  title: string;
  description: string;
}

interface User {
  _id: string;
  role: string;
}

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchUser();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/questions");
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser: { message: string; user: User } =
          JSON.parse(storedUser);
        if (parsedUser.user && parsedUser.user._id) {
          const response = await axios.get(
            `http://localhost:5000/users/${parsedUser.user._id}`
          );
          setUser(response.data);
        } else {
          // Handle invalid user data
        }
      } else {
        // Handle user not found in localStorage
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleAnswerQuestion = (questionId: string) => {
    // Redirect to the answer page for students
    window.location.href = `/questions/${questionId}/answer`;
  };

  const handleViewAnswers = (questionId: string) => {
    // Redirect to the view answers page for teachers
    window.location.href = `/questions/${questionId}/answers`;
  };

  return (
    <div>
      <Typography variant="h4">Questions</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question._id}>
              <TableCell>{question.title}</TableCell>
              <TableCell>{question.description}</TableCell>
              <TableCell>
                {user?.role === "Teacher" ? (
                  <Button onClick={() => handleViewAnswers(question._id)}>
                    View Answers
                  </Button>
                ) : (
                  <Button onClick={() => handleAnswerQuestion(question._id)}>
                    Answer
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsList;

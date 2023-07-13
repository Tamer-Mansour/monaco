import React, { useState, useEffect } from "react";
import axios from "axios";

interface Question {
  _id: string;
  title: string;
  description: string;
}

interface Answer {
  _id: string;
  studentId: string;
  answer: string;
}

const QuestionsList: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    // Fetch the list of questions
    axios
      .get("http://localhost:5000/questions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });

    // Fetch the list of answers
    axios
      .get("/answers")
      .then((response) => {
        setAnswers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching answers:", error);
      });
  }, []);

  const handleAnswerQuestion = (questionId: string) => {
    // Implement the logic for students to answer a question
    // You can redirect to a separate page or display a form here
  };

  const handleViewAnswers = (questionId: string) => {
    // Implement the logic for teachers to view students' answers to a question
    // You can redirect to a separate page or display a modal here
  };

  return (
    <div>
      <h2>Questions</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id}>
              <td>{question.title}</td>
              <td>{question.description}</td>
              <td>
                <button onClick={() => handleAnswerQuestion(question._id)}>
                  Answer
                </button>
                <button onClick={() => handleViewAnswers(question._id)}>
                  View Answers
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsList;

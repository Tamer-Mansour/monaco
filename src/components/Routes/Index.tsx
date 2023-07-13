import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "../auth/Signup";
import Home from "../Home/Index";
import Signin from "../auth/Signin";
import IDE from "../IDE/Index";
import Notfound from "../Pages/Notfound";
import Dashboard from "../dashbord/Dashboard";
import Profile from "../Pages/Profile";
import AddQuestion from "../questions";
import QuestionsList from "../questions/QuestionsList";
import Students from "../Pages/Students";
import StudentDetailsPage from "../Pages/StudentDetailsPage";
import AnswerQuestionPage from "../questions/AnswerQuestionPage";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

const AppRoutes: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isSignInPage = window.location.pathname === "/signin"; // Check if user is already on the sign-in page
    const isSignUpPage = window.location.pathname === "/signup";

    if (storedUser) {
      const parsedUser: { message: string; user: User } =
        JSON.parse(storedUser);

      if (parsedUser.user && parsedUser.user._id) {
        setUser(parsedUser.user);
      } else if (!isSignInPage && !isSignUpPage) {
        window.location.href = "/signin"; // Redirect to sign-in page if user is not signed in and not already on the sign-in or sign-up page
      }
    } else if (!isSignInPage && !isSignUpPage) {
      window.location.href = "/signin"; // Redirect to sign-in page if user is not signed in and not already on the sign-in or sign-up page
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protect the following routes */}
        {user ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/addquestions" element={<AddQuestion />} />
            <Route path="/questions" element={<QuestionsList />} />
            {/* <Route path="/ide" element={<IDE />} /> */}
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetailsPage />} />
            <Route path="/questions/:id/answer" element={<AnswerQuestionPage />} />
            <Route path="/*" element={<Notfound />} />
          </>
        ) : null}
      </Routes>
    </Router>
  );
};

export default AppRoutes;

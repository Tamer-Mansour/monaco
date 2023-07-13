import React from "react";
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

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"/>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addquestions" element={<AddQuestion />} />
        <Route path="/questions" element={<QuestionsList />} />
        <Route path="/ide" element={<IDE />} />
        <Route path="/*" element={<Notfound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

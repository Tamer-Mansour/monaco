import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "../auth/Signup";
import Home from "../Home/Index";
import Signin from "../auth/Signin";
import IDE from "../IDE/Index";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/signin" element={<Signin />} />
        <Route path="/signin" element={<Signup />} />
        <Route path="/home" element={<Home />} /> */}
        <Route path="/ide" element={<IDE />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

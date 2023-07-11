import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";

const HomePage: React.FC = () => {
  const [userData, setUserData] = useState([""]);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    console.log("7777777777777777777" + storedUser);
    console.log("2222222222222222222" + userData);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      console.log("3333333333333333" + parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  console.log("this is user data" + userData);
  return (
    <>
      <button onClick={handleLogout}>logout</button>
    </>
    // <div>
    //   <h1>Welcome to the Home Page</h1>
    //   {userData && (
    //     <div>
    //       <h2>User Information</h2>
    //       <p>Name: {userData.name}</p>
    //       <p>Email: {userData.email}</p>
    //       Render other user data as needed
    //     </div>
    //   )}
    // </div>
  );
};

export default HomePage;

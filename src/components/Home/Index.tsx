import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const state = (location.state as any)?.state;
    const _id = state?._id;

    if (_id) {
      fetchUserDetails(_id);
    }
  }, [location.state]);

  const fetchUserDetails = async (_id: string) => {
    try {
      const response = await axios.get<User>(
        `http://localhost:5000/users/${_id}`,
        {
          withCredentials: true,
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", null, {
        withCredentials: true,
      });

      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) {
    // Redirect to the sign-in page if user is not authenticated
    return <Navigate to="/signin" />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;

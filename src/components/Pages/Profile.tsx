import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Alert, CircularProgress } from "@mui/material";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  __v: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: { message: string; user: User } =
        JSON.parse(storedUser);

      if (parsedUser.user && parsedUser.user._id) {
        fetchUser(parsedUser.user._id);
      } else {
      }
    }
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      setUser(response.data);
      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/users/${user?._id}`,
        {
          name,
          email,
        }
      );
      setSuccessMessage("Profile updated successfully");

      // Update the stored user data in localStorage
      const updatedUser = { ...user, name, email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Error updating profile");
    }
  };

  return (
    <Container maxWidth="md">
      {user ? (
        <Box>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Welcome {name}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogout}>
          logout
          </Button>
          <TextField
            margin="normal"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      ) : (
        <Typography variant="body1" align="center">
          <CircularProgress />
        </Typography>
      )}
    </Container>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Students: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get<User[]>("http://localhost:5000/users");
      const allUsers = response.data;
      const studentUsers = allUsers.filter((user) => user.role === "Student");
      setStudents(studentUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <Link to={`/students/${student._id}`}>View Details</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Students;

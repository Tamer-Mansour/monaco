import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

interface Student {
  _id: string;
  name: string;
  email: string;
}

const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudentData();
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchStudentData = async () => {
    try {
      const userResponse = await axios.get(`http://localhost:5000/users/${id}`);
      const user: Student = userResponse.data;

      setStudent(user);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ width: 300 }}>
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Box>
    );
  }

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{student.name}</h2>
      <p>Email: {student.email}</p>
    </div>
  );
};

export default StudentDetailsPage;

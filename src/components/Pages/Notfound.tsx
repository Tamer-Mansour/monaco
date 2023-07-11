import React from 'react';
import { Box, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';

const primary = "#1976d2"; // #f44336  #1976d2

export default function Notfound() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '550px',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
    </Box>
  );
}
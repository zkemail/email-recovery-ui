import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface TimerProps {
  initialTime: number; // in seconds
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [time]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      display="flex"
      justifyContent="left"
      height="100%"
      fontSize="2rem"
      fontWeight="bold"
      fontFamily="'Roboto', sans-serif"
    >
      <Typography variant="h1" fontSize="inherit" fontWeight="inherit">
        {formatTime(time)}
      </Typography>
    </Box>
  );
};

export default Timer;

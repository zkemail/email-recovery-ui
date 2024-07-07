import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';

const InputNumber = ({ value, onChange, min = 1, ...props }) => {
  const handleIncrement = () => {
    if (value < Number.MAX_SAFE_INTEGER) {
      onChange({ target: { value: value + 1 } });
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange({ target: { value: value - 1 } });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '2px solid #DCDCDC',
        outline: 'none',
        borderRadius: '8px',
        paddingX: '0.2rem',
        width: '70px',  // Adjust width as necessary
      }}
    >
      <TextField
        value={value}
        onChange={onChange}
        type="number"
        inputProps={{ min }}
        variant="standard"  // Use standard variant to have more control over the styles
        sx={{
          color:'#667085',
          width: '3rem', 
          textAlign: 'center',
          '& .MuiInputBase-input': {
            textAlign: 'center', // Center the text
          },
          '& .MuiInputBase-root': {
            border: 'none', // Remove the default border
            '&:before, &:after': {
              display: 'none',  // Remove the focus outline
            },
          },
          // Hide default number input arrows
          '& input[type=number]': {
            '-moz-appearance': 'textfield',
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
        }}
        {...props}
      />
      <Box display="flex" flexDirection="column" ml={1}>
        <IconButton 
          size="small" 
          onClick={handleIncrement} 
          sx={{ 
            padding: 0,
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          <ArrowDropUp sx={{ padding: '2px' }} />
        </IconButton>
        <IconButton 
          size="small" 
          onClick={handleDecrement} 
          sx={{ 
            padding: 0,
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
          }}
        >
          <ArrowDropDown sx={{ padding: '2px' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default InputNumber;

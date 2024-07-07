import * as React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '&.MuiToggleButtonGroup-root': {
    backgroundColor: '#F6F6F6',
    borderRadius: '20px',
    padding: '4px',
  },
  '& .MuiToggleButton-root': {
    border: 'none',
    color: '#757575',
    borderRadius: '20px',
    '&.Mui-selected': {
      backgroundColor: 'white',
      color: 'black',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    },
  },
}));

export default function CustomizedToggleButton({ onFlowChange }) {
  const [alignment, setAlignment] = React.useState('setup');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      onFlowChange(newAlignment);
    }
  };

  return (
    <StyledToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="toggle button"
      sx={{marginY:'25px'}}
    >
      <ToggleButton value="setup" aria-label="set up">
        Set Up
      </ToggleButton>
      <ToggleButton value="recover" aria-label="recover">
        Recover
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
}

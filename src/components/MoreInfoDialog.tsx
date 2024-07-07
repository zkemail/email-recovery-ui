import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MoreInfoDialogProps {
  title: string;
  message: string;
}

const MoreInfoDialog: React.FC<MoreInfoDialogProps> = ({ title, message }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleClickOpen}
        sx={{ color: 'blue', '&:focus': { outline: 'none' } }}
      >
        <InfoOutlinedIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoreInfoDialog;

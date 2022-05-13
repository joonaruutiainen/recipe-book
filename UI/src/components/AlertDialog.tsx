import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export interface AlertDialogProps {
  open: boolean;
  title: string;
  text?: string;
  acceptText: string;
  declineText: string;
  onAccept: () => void;
  onDecline: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  text,
  acceptText,
  declineText,
  onAccept,
  onDecline,
}) => {
  const handleClose = () => {};

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        {text && (
          <DialogContent>
            <DialogContentText>{text}</DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={onDecline}>{declineText}</Button>
          <Button onClick={onAccept} autoFocus>
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertDialog;

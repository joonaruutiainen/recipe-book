import React from 'react';
import { Button } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

export interface TagButtonProps {
  text: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({ text, color, selected = false, onClick }) => (
  <Button
    variant='outlined'
    size='small'
    onClick={onClick}
    startIcon={selected ? <DoneIcon sx={{ color }} /> : undefined}
    sx={{
      width: 'max-content',
      fontSize: 16,
      paddingX: 3,
      textTransform: 'none',
      color,
      borderColor: color,
      borderRadius: 25,
      boxShadow: `1px 1px 3px 0px ${color}`,
      '&:hover': {
        cursor: 'pointer',
        color,
        borderColor: color,
        backgroundColor: 'transparent',
      },
    }}
  >
    {text}
  </Button>
);

export default TagButton;

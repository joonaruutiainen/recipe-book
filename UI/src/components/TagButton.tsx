import React from 'react';
import { Button } from '@mui/material';

export interface TagButtonProps {
  text: string;
  color: string;
  onClick?: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({ text, color, onClick }) => (
  <Button
    variant='outlined'
    size='small'
    onClick={onClick}
    sx={{
      width: 'max-content',
      fontSize: 18,
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

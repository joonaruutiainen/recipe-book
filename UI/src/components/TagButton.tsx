import React from 'react';
import { Button, SxProps } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

export interface TagButtonProps {
  text: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  sx?: SxProps;
}

const TagButton: React.FC<TagButtonProps> = ({ text, color, selected = false, onClick, sx = {} }) => (
  <Button
    variant='outlined'
    size='small'
    onClick={onClick}
    startIcon={selected ? <DoneIcon sx={{ color }} /> : undefined}
    sx={{
      width: 'max-content',
      fontSize: 15,
      paddingX: '10px',
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
      ...sx,
    }}
  >
    {text}
  </Button>
);

export default TagButton;

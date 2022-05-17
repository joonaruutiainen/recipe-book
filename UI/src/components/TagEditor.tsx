import React, { useState, useEffect } from 'react';
import { Menu, Stack, Box, Grid, Button, SxProps } from '@mui/material';
import TagButton from './TagButton';
import constants from '../constants';
import { RecipeTag } from '../types';

export interface TagEditorProps {
  anchorEl: HTMLDivElement | null;
  open: boolean;
  selection: RecipeTag[];
  onClose: () => void;
  onSave: (selection: RecipeTag[]) => void;
  sx?: SxProps;
  width?: string;
}

const TagEditor: React.FC<TagEditorProps> = ({ anchorEl, open, selection, onClose, onSave, sx = {}, width }) => {
  const [tagSelection, setTagSelection] = useState<RecipeTag[]>(selection);

  useEffect(() => {
    setTagSelection(selection);
  }, [selection]);

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      keepMounted
      open={open}
      onClose={() => {
        onClose();
        setTagSelection(selection);
      }}
      sx={{ mt: '20px', ...sx }}
      PaperProps={{
        style: {
          borderRadius: 7,
          maxWidth: width || '450px',
        },
      }}
    >
      <Stack direction='column' width='100%'>
        <Box sx={{ width: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
          <Grid container spacing={1} width='95%'>
            {constants.tags.map(tag => (
              <Grid key={tag.name} item>
                <TagButton
                  text={tag.name}
                  color={tag.color}
                  selected={Boolean(tagSelection.find(t => t.name === tag.name))}
                  onClick={() => {
                    if (tagSelection.find(t => t.name === tag.name))
                      setTagSelection(tagSelection.filter(t => t.name !== tag.name));
                    else setTagSelection(tagSelection.concat([tag]));
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Stack direction='row' width='100%' justifyContent='space-between'>
          <Button
            size='small'
            sx={{
              fontSize: 20,
              paddingX: 3,
              textTransform: 'none',
              borderRadius: 25,
            }}
            onClick={() => {
              onClose();
              setTagSelection(selection);
            }}
          >
            Peruuta
          </Button>
          <Button
            color='secondary'
            size='small'
            sx={{
              fontSize: 20,
              paddingX: 3,
              textTransform: 'none',
              borderRadius: 25,
            }}
            onClick={() => onSave(tagSelection)}
          >
            Tallenna
          </Button>
        </Stack>
      </Stack>
    </Menu>
  );
};

export default TagEditor;

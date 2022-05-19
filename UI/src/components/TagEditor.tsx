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

  const save = () => {
    onSave(tagSelection);
  };

  const cancel = () => {
    onClose();
    setTagSelection(selection);
  };

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
      <Stack direction='column' width='100%' alignItems='center'>
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
        <Stack direction='row' width='95%' justifyContent='space-between'>
          <Button onClick={cancel}>Peruuta</Button>
          <Button color='secondary' onClick={save}>
            Tallenna
          </Button>
        </Stack>
      </Stack>
    </Menu>
  );
};

export default TagEditor;

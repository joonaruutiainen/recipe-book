import React, { useState } from 'react';
import { Stack, TextField, MenuItem, Typography, Button, Radio } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import constants from '../constants';
import { RecipeIngredient, RecipeSubtitle } from '../types';

export interface IngredientEditorProps {
  ingredient: RecipeIngredient;
  subtitle?: RecipeSubtitle;
  onClose: () => void;
  onSave: (ingredient: RecipeIngredient) => void;
}

const IngredientEditor: React.FC<IngredientEditorProps> = ({ ingredient, subtitle, onClose, onSave }) => {
  const [ignoreIngredientQuantity, setIgnoreIngredientQuantity] = useState(
    Boolean(ingredient.quantity === undefined && ingredient.unit === undefined)
  );
  const [quantity, setQuantity] = useState<number>(ingredient.quantity || 1);
  const [unit, setUnit] = useState<string>(ingredient.unit || 'kpl');
  const [description, setDescription] = useState<string>(ingredient.description);
  const [missingDescription, setMissingDescription] = useState(false);

  const save = () => {
    if (!description) setMissingDescription(true);
    else if (ignoreIngredientQuantity) onSave({ description, subtitle });
    else onSave({ quantity, unit, description, subtitle });
  };

  return (
    <Stack direction='column' spacing={1} width='100%'>
      <Stack direction='row' spacing={1} alignItems='center' width='100%'>
        <TextField
          label='Määrä'
          type='number'
          size='small'
          value={quantity}
          onChange={e => setQuantity(parseFloat(e.target.value))}
          disabled={ignoreIngredientQuantity}
          inputProps={{
            min: 0.1,
            max: 1000,
            step: 0.1,
          }}
          sx={{ width: '120px' }}
        />
        <TextField
          select
          label='Yksikkö'
          size='small'
          value={unit}
          onChange={e => setUnit(e.target.value)}
          disabled={ignoreIngredientQuantity}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { maxHeight: 200 },
              },
            },
          }}
          sx={{ width: '120px' }}
        >
          {constants.validUnits.map(u => (
            <MenuItem key={u} value={u}>
              {u}
            </MenuItem>
          ))}
        </TextField>
        <Radio
          checked={ignoreIngredientQuantity}
          size='small'
          onClick={() => setIgnoreIngredientQuantity(!ignoreIngredientQuantity)}
        />
        <Typography variant='body1'>Ei määrää</Typography>
      </Stack>
      <TextField
        label='Kuvaus'
        size='small'
        error={missingDescription}
        inputProps={{ maxLength: 100 }}
        value={description}
        onChange={e => {
          if (missingDescription) setMissingDescription(false);
          setDescription(e.target.value);
        }}
      />
      <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' width='100%'>
        <Button endIcon={<CloseIcon color='primary' />} onClick={onClose}>
          Poista ainesosa
        </Button>
        <Button endIcon={<DoneIcon color='primary' />} onClick={save}>
          Tallenna
        </Button>
      </Stack>
    </Stack>
  );
};

export default IngredientEditor;

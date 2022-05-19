import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack, Card, CardMedia, Tooltip, Box, Typography, IconButton } from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TagButton from './TagButton';
import { Recipe } from '../types';
import { useAppDispatch } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';

export interface RecipeGridItemProps {
  recipe: Recipe;
}

const RecipeGridItem: React.FC<RecipeGridItemProps> = ({ recipe }) => {
  const [inFavorites, setInFavorites] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Grid container item sm={12} md={6} lg={4} xl={3} key={recipe.id} justifyContent='center' alignItems='center'>
      <Card
        sx={{
          width: '370px',
          height: '320px',
          justifyContent: 'space-between',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
        onClick={() => {
          dispatch(recipeActions.selectRecipe(recipe.id));
          navigate(recipe.id);
        }}
      >
        {recipe.image && (
          <CardMedia
            component='img'
            image={`http://localhost:8080/api/v1/recipes/${recipe.id}/image`}
            crossOrigin='use-credentials'
            sx={{ height: '55%' }}
          />
        )}
        {!recipe.image && (
          <Box
            sx={{
              width: '100%',
              height: '55%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: 'linear-gradient(to bottom right, #e2e0dc, #b1afac)',
            }}
          >
            <ImageNotSupportedIcon color='primary' />
            <Typography variant='subtitle1'>Ei kuvaa</Typography>
          </Box>
        )}
        <Stack spacing={1} width='95%' height='40%'>
          <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1} width='100%'>
            <Typography variant='h5' fontWeight='bold'>
              {recipe.title}
            </Typography>
            <Tooltip title={inFavorites ? 'Poista suosikeista' : 'Lisää suosikkeihin'}>
              <IconButton
                onMouseDown={e => e.stopPropagation()}
                onClick={e => {
                  e.stopPropagation();
                  setInFavorites(!inFavorites);
                }}
                sx={{ p: '1px' }}
              >
                <StarIcon
                  color={inFavorites ? 'secondary' : 'primary'}
                  sx={{
                    borderRadius: 25,
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1}>
            <AccessTimeIcon />
            {recipe.duration.hours > 0 && <Typography variant='body1'>{recipe.duration.hours}h</Typography>}
            {recipe.duration.minutes > 0 && <Typography variant='body1'>{recipe.duration.minutes}min</Typography>}
          </Stack>
          <Stack direction='row' alignItems='center' spacing={1}>
            {recipe.tags?.slice(0, 3).map(tag => (
              <TagButton key={tag.name} text={tag.name} color={tag.color} />
            ))}
            {recipe.tags && recipe.tags.length > 3 && (
              <TagButton text={`+${recipe.tags.length - 3}`} color='#554F43' sx={{ paddingX: 0, minWidth: '40px' }} />
            )}
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );
};

export default RecipeGridItem;

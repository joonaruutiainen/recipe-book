import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Grid, Divider, Button, Typography, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';
import { TagButton } from '../components';

const Recipe = () => {
  const { selected: recipe, error } = useAppSelector(state => state.recipes);
  const [selectedPortionSize, setSelectedPortionSize] = useState(recipe?.portionSize || 1);
  const { recipeId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!recipe && !error && recipeId) dispatch(recipeActions.getRecipe(recipeId));
  }, [dispatch, recipe, error]);

  return (
    <div style={{ width: '100%', height: '100%', paddingTop: '40px' }}>
      {error && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <div>{error.message}</div>
          <button
            type='button'
            onClick={() => {
              navigate('/');
              dispatch(recipeActions.clearError());
            }}
          >
            Palaa etusivulle
          </button>
        </div>
      )}
      {recipe && (
        <Grid container justifyContent='center' rowSpacing={5}>
          <Grid container item md={12} lg={2} justifyContent='center' alignItems='center' height={10}>
            <Button
              variant='outlined'
              onClick={() => {
                navigate('/recipes');
                dispatch(recipeActions.clearSelectedRecipe());
              }}
            >
              <ArrowBackIcon />
            </Button>
          </Grid>
          <Grid container item md={12} lg={4} justifyContent='flex-start' alignItems='center'>
            <Stack direction='column' justifyContent='flex-start' spacing={2} width='100%'>
              <div style={{ width: '100%', height: '300px', backgroundColor: 'white' }} />
              <Typography variant='h1'>{recipe.title}</Typography>
              <Stack direction='row' justifyContent='space-between' width='100%'>
                <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={1}>
                  <AccessTimeIcon />
                  <Typography variant='h6'>
                    {recipe.duration.hours > 0
                      ? `${recipe.duration.hours}h ${recipe.duration.minutes}min valmistusaika`
                      : `${recipe.duration.minutes}min valmistusaika`}
                  </Typography>
                </Stack>
                <Button startIcon={<StarIcon />} sx={{ fontSize: 20, textTransform: 'none' }}>
                  Lisää suosikkilistalle
                </Button>
                <Button startIcon={<PeopleIcon />} sx={{ fontSize: 20, textTransform: 'none' }}>
                  Julkaise
                </Button>
              </Stack>
              <Stack direction='row' justifyContent='flex-start' spacing={2} width='100%'>
                {recipe.tags?.map(tag => (
                  <TagButton key={tag.name} text={tag.name} color={tag.color} />
                ))}
              </Stack>
              <Typography variant='h6'>{recipe.description}</Typography>
              <Stack direction='row' justifyContent='space-between' width='100%'>
                <Typography variant='h4'>Ainesosat</Typography>
                <Stack direction='row' justifyContent='space-between' alignItems='center' width='30%'>
                  <IndeterminateCheckBoxIcon
                    color='secondary'
                    onClick={selectedPortionSize > 1 ? () => setSelectedPortionSize(n => n - 1) : undefined}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  />
                  <Typography variant='h5'>
                    {selectedPortionSize === 1 ? '1 annos' : `${selectedPortionSize} annosta`}
                  </Typography>
                  <AddBoxIcon
                    color='secondary'
                    onClick={() => setSelectedPortionSize(n => n + 1)}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  />
                </Stack>
              </Stack>
              <Stack direction='column' justifyContent='flex-start' width='100%' spacing={4}>
                {recipe.subtitles &&
                  recipe.subtitles?.map(st => (
                    <Stack
                      key={st}
                      direction='column'
                      width='100%'
                      divider={<Divider orientation='horizontal' flexItem />}
                      spacing={1}
                    >
                      <Typography variant='h6'>{st}</Typography>
                      <Stack direction='column' justifyContent='flex-start' width='100%' spacing={1}>
                        {recipe.ingredients
                          .filter(i => i.subtitle === st)
                          .map(i => (
                            <Stack key={i.description} direction='row' justifyContent='flex-end'>
                              <div style={{ width: '20%' }}>
                                {i.quantity && i.unit && (
                                  <Typography variant='h6'>
                                    {i.quantity} {i.unit}
                                  </Typography>
                                )}
                              </div>
                              <div style={{ width: '50%' }}>
                                <Typography variant='h6'>{i.description}</Typography>
                              </div>
                            </Stack>
                          ))}
                      </Stack>
                    </Stack>
                  ))}
                {!recipe.subtitles &&
                  recipe.ingredients.map(i => (
                    <div>
                      {i.quantity && i.unit && (
                        <Typography variant='h6'>
                          {i.quantity} {i.unit}
                        </Typography>
                      )}
                      <Typography variant='h6'>{i.description}</Typography>
                    </div>
                  ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid container item md={12} lg={4} justifyContent='flex-start' alignItems='center'>
            {recipe.instructions.map(i => (
              <div key={i.index}>{i.title}</div>
            ))}
          </Grid>
          <Grid container item md={12} lg={2} justifyContent='flex-start' alignItems='center'>
            Modify button
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Recipe;

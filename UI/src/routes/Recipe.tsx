import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Grid, Divider, Button, Typography, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';
import { TagButton } from '../components';

const Recipe = () => {
  const { selected: recipe, error } = useAppSelector(state => state.recipes);
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
                <Typography variant='h6'>
                  {recipe.duration.hours > 0
                    ? `${recipe.duration.hours}h ${recipe.duration.minutes}min valmistusaika`
                    : `${recipe.duration.minutes}min valmistusaika`}
                </Typography>
                <Typography variant='h6'>Lisää suosikkilistalle</Typography>
                <Typography variant='h6'>Julkaise</Typography>
              </Stack>
              <Stack direction='row' justifyContent='flex-start' spacing={2} width='100%'>
                {recipe.tags?.map(tag => (
                  <TagButton key={tag.name} text={tag.name} color={tag.color} />
                ))}
              </Stack>
              <Typography variant='h6'>{recipe.description}</Typography>
              <Stack direction='row' justifyContent='space-between' width='100%'>
                <Typography variant='h4'>Ainesosat</Typography>
                <Typography variant='h5'>{recipe.portionSize} annosta</Typography>
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
                            <Stack direction='row' justifyContent='flex-end'>
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

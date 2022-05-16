import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Grid, Card, Divider, Button, Typography, Container, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions, SelectionFilter } from '../redux/slices/recipesSlice';
import { TagButton } from '../components';
import { Recipe } from '../types';

const Recipes = () => {
  const user = useAppSelector(state => state.auth.user);
  const { all: recipes, loadingMany: loading, selectionFilter } = useAppSelector(state => state.recipes);
  const [selection, setSelection] = useState<Recipe[]>([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectionFilter === SelectionFilter.all) setSelection(recipes);
    else if (selectionFilter === SelectionFilter.myRecipes) setSelection(recipes.filter(r => r.user.id === user?.id));
  }, [selectionFilter, recipes]);

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Container maxWidth='xl'>
        <Stack
          direction='row'
          justifyContent='flex-start'
          width='100%'
          divider={<Divider orientation='vertical' flexItem />}
          spacing={2}
          marginTop={3}
          marginBottom={5}
        >
          <Button
            color={selectionFilter === SelectionFilter.all ? 'secondary' : 'primary'}
            onClick={() => {
              if (!(selectionFilter === SelectionFilter.all))
                dispatch(recipeActions.setSelectionFilter(SelectionFilter.all));
            }}
          >
            {user ? 'Kaikki reseptit' : 'Julkaistut reseptit'}
          </Button>
          <Button
            color={selectionFilter === SelectionFilter.myRecipes ? 'secondary' : 'primary'}
            onClick={() => {
              if (!user) navigate('/login');
              else if (!(selectionFilter === SelectionFilter.myRecipes))
                dispatch(recipeActions.setSelectionFilter(SelectionFilter.myRecipes));
            }}
          >
            Omat reseptit
          </Button>
        </Stack>
        <Grid container justifyContent='flex-start' rowSpacing={6} sx={{ mb: 5 }}>
          {selection.map(recipe => (
            <Grid
              container
              item
              sm={12}
              md={6}
              lg={4}
              xl={3}
              key={recipe.id}
              justifyContent='center'
              alignItems='center'
            >
              <Card
                sx={{
                  width: '370px',
                  height: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                  textAlign: 'center',
                  boxShadow: '2px 3px 15px 2px rgba(57, 53, 44, 0.4)',
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                onClick={() => {
                  dispatch(recipeActions.selectRecipe(recipe.id));
                  navigate(recipe.id);
                }}
              >
                <Stack alignItems='center' spacing={2}>
                  <Typography variant='h2'>{recipe.title}</Typography>
                  <Typography variant='h4'>
                    {recipe.duration.hours}h {recipe.duration.minutes}min
                  </Typography>
                  {recipe.tags?.map(tag => (
                    <TagButton key={tag.name} text={tag.name} color={tag.color} />
                  ))}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Recipes;

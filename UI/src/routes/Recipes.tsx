import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Grid,
  Card,
  Divider,
  Button,
  Typography,
  Container,
  CircularProgress,
  CardMedia,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                    <Tooltip title='Lisää suosikkeihin'>
                      <IconButton sx={{ p: '1px' }}>
                        <StarIcon
                          color='primary'
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
                    {recipe.duration.minutes > 0 && (
                      <Typography variant='body1'>{recipe.duration.minutes}min</Typography>
                    )}
                  </Stack>
                  <Stack direction='row' alignItems='center' spacing={1}>
                    {recipe.tags?.slice(0, 3).map(tag => (
                      <TagButton key={tag.name} text={tag.name} color={tag.color} />
                    ))}
                    {recipe.tags && recipe.tags.length > 3 && (
                      <TagButton
                        text={`+${recipe.tags.length - 3}`}
                        color='#554F43'
                        sx={{ paddingX: 0, minWidth: '40px' }}
                      />
                    )}
                  </Stack>
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

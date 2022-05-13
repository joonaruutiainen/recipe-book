import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Grid, Divider, Button, Typography, Card, Box } from '@mui/material';
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
          <Grid container item xs={1.5} justifyContent='center' alignItems='center' height={10}>
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
          <Grid container item md={10.5} xl={4.5} direction='column' justifyContent='flex-start' alignItems='flex-end'>
            <Stack
              direction='column'
              justifyContent='flex-start'
              spacing={2}
              width='95%'
              maxWidth='700px'
              marginRight={5}
            >
              <div style={{ width: '100%', height: '350px', backgroundColor: 'white' }} />
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
                <Stack direction='row' justifyContent='space-between' alignItems='center' width='200px'>
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
          <Grid
            container
            item
            md={10.5}
            xl={4.5}
            direction='column'
            justifyContent='flex-start'
            alignItems='flex-start'
          >
            <Box
              sx={{
                width: '95%',
                maxWidth: '700px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: 5,
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  height: '90vh',
                  position: 'sticky',
                  top: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  boxShadow: '2px 3px 15px 2px rgba(57, 53, 44, 0.4)',
                }}
              >
                <Stack
                  direction='column'
                  justifyContent='flex-start'
                  alignItems='center'
                  divider={<Divider orientation='horizontal' flexItem />}
                  spacing={3}
                  sx={{ margin: 5 }}
                >
                  <Typography variant='h2'>Valmistusohje</Typography>
                  {recipe.instructions.map(step => (
                    <Stack key={step.index} direction='column' width='100%' spacing={1}>
                      <Stack
                        direction='row'
                        justifyContent='flex-start'
                        alignItems='center'
                        divider={<Divider orientation='vertical' flexItem />}
                        spacing={2}
                      >
                        <Typography variant='h3' width={15}>
                          {step.index}
                        </Typography>
                        <Typography variant='h3'>{step.title}</Typography>
                      </Stack>
                      <Typography variant='h6'>{step.description}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Card>
            </Box>
          </Grid>
          <Grid
            container
            item
            xs={1.5}
            direction='column'
            justifyContent='flex-end'
            alignItems='center'
            marginBottom={11}
          >
            <Stack direction='column' justifyContent='flex-end' alignItems='center' spacing={1}>
              <Button
                variant='outlined'
                size='small'
                color='secondary'
                sx={{
                  width: '200px',
                  fontSize: 20,
                  paddingX: 3,
                  textTransform: 'none',
                  borderRadius: 25,
                }}
              >
                Poista
              </Button>
              <Button
                variant='contained'
                size='small'
                color='secondary'
                sx={{
                  width: '200px',
                  fontSize: 20,
                  paddingX: 3,
                  textTransform: 'none',
                  borderRadius: 25,
                }}
              >
                Muokkaa
              </Button>
            </Stack>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Recipe;

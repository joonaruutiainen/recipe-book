import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
  Card,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions } from '../redux/slices/recipesSlice';
import { userActions } from '../redux/slices/usersSlice';
import { authActions } from '../redux/slices/authSlice';
import { AlertDialog, TagButton } from '../components';
import { RecipeIngredient, RecipeStep } from '../types';

const Recipe = () => {
  const { user } = useAppSelector(state => state.auth);
  const { selected: recipe, loadingOne: loading, error } = useAppSelector(state => state.recipes);
  const { userUpdated: favoritesUpdated, selected: updatedUser } = useAppSelector(state => state.users);
  const [inFavorites, setInFavorites] = useState(false);
  const [selectedPortionSize, setSelectedPortionSize] = useState(recipe?.portionSize || 1);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [recipeDeleted, setRecipeDeleted] = useState(false);
  const { recipeId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!recipe && !error && recipeId && !recipeDeleted) dispatch(recipeActions.getRecipe(recipeId));
  }, [dispatch, recipe, error]);

  useEffect(() => {
    if (favoritesUpdated && updatedUser) {
      dispatch(authActions.updateCurrentUser(updatedUser));
      dispatch(userActions.clearSelectedUser());
      dispatch(userActions.clearUserUpdated());
    }
  }, [favoritesUpdated, updatedUser]);

  useEffect(() => {
    if (user && recipe) setInFavorites(user.favorites.includes(recipe.id));
  }, [user, recipe]);

  const toggleInFavorites = () => {
    if (!user) navigate('/login');
    else if (recipe)
      dispatch(
        userActions.updateUserFavorites({
          userId: user.id,
          recipeId: recipe.id,
          value: !inFavorites,
        })
      );
  };

  const singleIngredient = (index: number, ingr: RecipeIngredient) => (
    <Stack key={index} direction='row' justifyContent='flex-end' width='100%'>
      <Box sx={{ width: '20%' }}>
        {ingr.quantity && ingr.unit && (
          <Typography variant='body1'>
            {ingr.quantity} {ingr.unit}
          </Typography>
        )}
      </Box>
      <Box sx={{ width: '50%' }}>
        <Typography variant='body1'>{ingr.description}</Typography>
      </Box>
    </Stack>
  );

  const recipeDescriptionColumn = recipe ? (
    <Stack
      direction='column'
      justifyContent='flex-start'
      spacing={2}
      width='95%'
      maxWidth='720px'
      marginRight={5}
      paddingBottom={10}
    >
      {recipe.image && (
        <Box
          sx={{ width: '100%', maxHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <img
            crossOrigin='use-credentials'
            src={`http://localhost:8080/api/v1/recipes/${recipe.id}/image`}
            alt=''
            style={{ borderRadius: '7px', maxWidth: '100%', maxHeight: '100%' }}
          />
        </Box>
      )}
      <Typography variant='h1'>{recipe.title}</Typography>
      <Stack direction='row' justifyContent='space-between' width='100%'>
        <Stack direction='row' alignItems='center' spacing={1}>
          <AccessTimeIcon />
          {recipe.duration.hours > 0 && <Typography variant='body1'>{recipe.duration.hours}h</Typography>}
          {recipe.duration.minutes > 0 && <Typography variant='body1'>{recipe.duration.minutes}min</Typography>}
          <Typography variant='body1'>valmistusaika</Typography>
        </Stack>
        <Tooltip title={inFavorites ? 'Poista suosikeista' : ''}>
          <Button startIcon={<StarIcon />} onClick={toggleInFavorites} color={inFavorites ? 'secondary' : 'primary'}>
            {inFavorites ? 'Lisätty suosikkeihin' : 'Lisää suosikkeihin'}
          </Button>
        </Tooltip>
        <Button startIcon={<PeopleIcon />}>Julkaise</Button>
      </Stack>
      <Stack direction='row' justifyContent='flex-start' spacing={1} width='100%'>
        {recipe.tags?.map(tag => (
          <TagButton key={tag.name} text={tag.name} color={tag.color} />
        ))}
      </Stack>
      <Typography variant='body1' align='justify'>
        {recipe.description}
      </Typography>
      <Stack direction='row' spacing={1}>
        <Typography variant='subtitle2'>Reseptin on lisännyt:</Typography>
        <Typography variant='subtitle2' fontWeight='bold'>
          {recipe.user.name}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between' width='100%'>
        <Typography variant='h4'>Ainesosat</Typography>
        <Stack direction='row' justifyContent='space-between' alignItems='center' width='200px'>
          <IconButton
            color='secondary'
            onClick={selectedPortionSize > 1 ? () => setSelectedPortionSize(n => n - 1) : undefined}
            sx={{ p: 1 }}
          >
            <IndeterminateCheckBoxIcon
              color='secondary'
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </IconButton>
          <Typography variant='h5'>
            {selectedPortionSize === 1 ? '1 annos' : `${selectedPortionSize} annosta`}
          </Typography>
          <IconButton color='secondary' onClick={() => setSelectedPortionSize(n => n + 1)} sx={{ p: 1 }}>
            <AddBoxIcon
              color='secondary'
              sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </IconButton>
        </Stack>
      </Stack>
      <Stack direction='column' justifyContent='flex-start' width='100%' spacing={4}>
        {recipe.subtitles &&
          recipe.subtitles.length > 0 &&
          recipe.subtitles.map(st => (
            <Stack
              key={st.index}
              direction='column'
              width='100%'
              divider={<Divider orientation='horizontal' flexItem />}
              spacing={1}
            >
              <Typography variant='body1'>{st.name}</Typography>
              <Stack direction='column' justifyContent='flex-start' width='100%' spacing={1}>
                {recipe.ingredients
                  .filter(i => i.subtitle?.name === st.name)
                  .map((ingr, index) => singleIngredient(index, ingr))}
              </Stack>
            </Stack>
          ))}
        {!(recipe.subtitles && recipe.subtitles.length > 0) && (
          <Stack direction='column' spacing={1} divider={<Divider orientation='horizontal' flexItem />} width='100%'>
            {recipe.ingredients.map((ingr, index) => singleIngredient(index, ingr))}
          </Stack>
        )}
      </Stack>
    </Stack>
  ) : (
    <div />
  );

  const instructionStep = (step: RecipeStep) => (
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
      <Typography variant='body1' align='justify'>
        {step.description}
      </Typography>
    </Stack>
  );

  const recipeInstructionsColumn = recipe ? (
    <Box
      sx={{
        width: '95%',
        maxWidth: '720px',
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
          height: '87vh',
          position: 'sticky',
          top: '20px',
          overflowY: 'auto',
        }}
      >
        <Stack
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          spacing={3}
          width='90%'
          sx={{ margin: 5 }}
        >
          <Typography variant='h2'>Valmistusohje</Typography>
          <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />} width='100%'>
            {recipe.instructions.map(step => instructionStep(step))}
          </Stack>
        </Stack>
      </Card>
    </Box>
  ) : (
    <div />
  );

  const leftColumn = (
    <Stack
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      spacing={1}
      sx={{
        width: '100%',
        position: 'sticky',
        top: '20px',
      }}
    >
      <Button
        variant='outlined'
        size='large'
        onClick={() => {
          navigate('/recipes');
          dispatch(recipeActions.clearSelectedRecipe());
        }}
      >
        <ArrowBackIcon />
      </Button>
    </Stack>
  );

  const rightColumn =
    user?.admin || user?.id === recipe?.user.id ? (
      <Stack
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        spacing={1}
        sx={{
          width: '100%',
          position: 'sticky',
          bottom: '50px',
        }}
      >
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => setConfirmDeleteDialog(true)}
          sx={{ width: '150px' }}
        >
          Poista
        </Button>
        <Button variant='contained' color='secondary' onClick={() => navigate('/recipeEditor')} sx={{ width: '150px' }}>
          Muokkaa
        </Button>
      </Stack>
    ) : (
      <div />
    );

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <div style={{ width: '100%', height: '100%', paddingTop: '40px' }}>
      {(error || recipeDeleted) && (
        <Stack direction='column' justifyContent='center' alignItems='center' spacing={2}>
          <Typography variant='body1'>{error?.message || 'Resepti poistettu onnistuneesti'}</Typography>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              navigate('/recipes');
              dispatch(recipeActions.clearError());
            }}
            sx={{ width: '220px' }}
          >
            Palaa etusivulle
          </Button>
        </Stack>
      )}
      {recipe && (
        <>
          <Grid container justifyContent='center' rowSpacing={5}>
            <Grid container item xs={1.5} direction='column' alignItems='center'>
              {leftColumn}
            </Grid>
            <Grid
              container
              item
              md={10.5}
              xl={4.5}
              direction='column'
              sx={{
                alignItems: { xs: 'center', md: 'flex-start', xl: 'flex-end' },
              }}
            >
              {recipeDescriptionColumn}
            </Grid>
            <Grid
              container
              item
              md={10.5}
              xl={4.5}
              direction='column'
              sx={{
                alignItems: { xs: 'center', md: 'flex-start' },
                ml: { xs: 0, md: 5, xl: 0 },
              }}
            >
              {recipeInstructionsColumn}
            </Grid>
            <Grid container item xs={1.5} direction='column' justifyContent='flex-end' alignItems='center'>
              {rightColumn}
            </Grid>
          </Grid>
          <AlertDialog
            open={confirmDeleteDialog}
            title='Poista resepti'
            text='Haluatko varmasti poistaa tämän reseptin?'
            acceptText='Poista'
            declineText='Peruuta'
            onAccept={() => {
              dispatch(recipeActions.deleteRecipe(recipe.id));
              setRecipeDeleted(true);
              setConfirmDeleteDialog(false);
            }}
            onDecline={() => setConfirmDeleteDialog(false)}
          />
        </>
      )}
    </div>
  );
};

export default Recipe;

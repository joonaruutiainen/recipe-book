import React, { useEffect, useState, useRef } from 'react';
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
  Paper,
  InputBase,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RecipeIcon from '../img/recipe.png';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { recipeActions, SelectionFilter } from '../redux/slices/recipesSlice';
import { TagButton, TagEditor } from '../components';
import { Recipe, RecipeTag } from '../types';

const Recipes = () => {
  const user = useAppSelector(state => state.auth.user);
  const { all: recipes, loadingMany: loading, selectionFilter } = useAppSelector(state => state.recipes);

  const [selection, setSelection] = useState<Recipe[]>([]);

  const [searchFilter, setSearchFilter] = useState<string>('');

  const [tagFilters, setTagFilters] = useState<RecipeTag[]>([]);
  const [anchorElTags, setAnchorElTags] = useState<null | HTMLDivElement>(null);

  const searchBarRef = useRef<HTMLDivElement>(null);

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
          justifyContent='space-between'
          alignItems='center'
          width='100%'
          marginTop={3}
          marginBottom={5}
        >
          <Stack
            direction='row'
            justifyContent='flex-start'
            divider={<Divider orientation='vertical' flexItem />}
            spacing={2}
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
            <Button
              color={selectionFilter === SelectionFilter.favorites ? 'secondary' : 'primary'}
              onClick={() => {
                if (!user) navigate('/login');
                else if (!(selectionFilter === SelectionFilter.favorites))
                  dispatch(recipeActions.setSelectionFilter(SelectionFilter.favorites));
              }}
            >
              Suosikit
            </Button>
          </Stack>
          <Paper
            ref={searchBarRef}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 500,
              height: 50,
              boxShadow: '1px 1px 6px 0px rgba(57, 53, 44, 0.6)',
            }}
          >
            {tagFilters.length === 0 && <SearchIcon color='primary' sx={{ ml: 1 }} />}
            <Stack direction='row' alignItems='center' spacing={0.5} sx={{ maxWidth: '70%' }}>
              {tagFilters.slice(0, 4).map(tag => (
                <Typography variant='body2'>{tag.name};</Typography>
              ))}
              {tagFilters.length > 4 && <Typography variant='body2'>+{tagFilters.length - 4} muuta</Typography>}
            </Stack>
            <InputBase sx={{ ml: 1, flex: 1 }} value={searchFilter} onChange={e => setSearchFilter(e.target.value)} />
            {(tagFilters.length > 0 || searchFilter) && (
              <Tooltip title='Tyhjennä hakusuodattimet'>
                <IconButton
                  size='small'
                  onClick={() => {
                    setSearchFilter('');
                    setTagFilters([]);
                  }}
                >
                  <CloseIcon color='primary' />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title='Rajaa hakua tunnisteilla'>
              <IconButton onClick={() => setAnchorElTags(searchBarRef.current)} size='small'>
                <TuneIcon color='primary' />
              </IconButton>
            </Tooltip>
            <TagEditor
              anchorEl={anchorElTags}
              open={Boolean(anchorElTags)}
              selection={tagFilters}
              onClose={() => {
                setAnchorElTags(null);
              }}
              onSave={(tagSelection: RecipeTag[]) => {
                setTagFilters(tagSelection);
                setAnchorElTags(null);
              }}
              sx={{ mt: 1 }}
              width='500px'
            />
          </Paper>
          <Stack direction='row' alignItems='center' spacing={2}>
            <IconButton
              onClick={() => navigate('/recipeEditor')}
              color='secondary'
              sx={{
                p: '12px',
                border: 'solid',
                borderWidth: 2,
                borderColor: '#FFCDDF',
                backgroundColor: '#EC216A',
                boxShadow: '1px 2px 5px 0px rgba(57, 53, 44, 0.6)',
                '&:hover': {
                  backgroundColor: '#EC216A',
                  borderColor: 'white',
                },
                '&:active': {
                  boxShadow: '1px 2px 6px 0px rgba(57, 53, 44, 0.3)',
                },
              }}
            >
              <img
                src={RecipeIcon}
                alt=''
                width={70}
                style={{ filter: 'drop-shadow(3px 3px 7px rgba(57, 53, 44, 0.6))' }}
              />
            </IconButton>
            <Typography variant='h5'>Lisää uusi resepti!</Typography>
          </Stack>
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

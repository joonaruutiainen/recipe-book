import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack, Divider, Paper, InputBase, Tooltip, Button, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import RecipeIcon from '../img/recipe.png';
import TagEditor from './TagEditor';
import { recipeActions, SelectionFilter } from '../redux/slices/recipesSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RecipeTag } from '../types';

export interface RecipesControlBarProps {
  onFilterChange: (searchFilter?: string, tagFilters?: RecipeTag[]) => void;
}

const RecipesControlBar: React.FC<RecipesControlBarProps> = ({ onFilterChange }) => {
  const user = useAppSelector(state => state.auth.user);
  const { selectionFilter, selected } = useAppSelector(state => state.recipes);

  const [searchFilter, setSearchFilter] = useState<string>('');

  const [tagFilters, setTagFilters] = useState<RecipeTag[]>([]);
  const [anchorElTags, setAnchorElTags] = useState<null | HTMLDivElement>(null);

  const searchBarRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchFilter && tagFilters.length > 0) onFilterChange(searchFilter, tagFilters);
    else if (searchFilter) onFilterChange(searchFilter);
    else if (tagFilters.length > 0) onFilterChange(undefined, tagFilters);
    else onFilterChange();
  }, [searchFilter, tagFilters]);

  const selectionControls = (
    <Grid container item lg={4.5} md={6.5} sm={12} justifyContent={{ sm: 'center' }}>
      <Stack
        direction='row'
        justifyContent='flex-start'
        divider={<Divider orientation='vertical' flexItem />}
        spacing={0.5}
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
    </Grid>
  );

  const filterControls = (
    <Grid container item lg={4} md={5.5} sm={12} justifyContent='center'>
      <Paper
        ref={searchBarRef}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 460,
          height: 50,
          boxShadow: '1px 1px 6px 0px rgba(57, 53, 44, 0.6)',
        }}
      >
        {tagFilters.length === 0 && <SearchIcon color='primary' sx={{ ml: 1 }} />}
        <Stack direction='row' alignItems='center' spacing={0.5} sx={{ maxWidth: '70%' }}>
          {tagFilters.slice(0, 3).map(tag => (
            <Typography key={tag.name} variant='body2'>
              {tag.name};
            </Typography>
          ))}
          {tagFilters.length > 3 && <Typography variant='body2'>+{tagFilters.length - 3} muuta</Typography>}
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
          width='460px'
        />
      </Paper>
    </Grid>
  );

  const newRecipeButton = (
    <Grid container item lg={3.5} md={12} justifyContent={{ sm: 'center', lg: 'flex-end' }}>
      <Stack direction='row' alignItems='center' spacing={2}>
        <IconButton
          onClick={() => {
            if (selected) dispatch(recipeActions.clearSelectedRecipe());
            navigate('/recipeEditor');
          }}
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
            width={65}
            style={{ filter: 'drop-shadow(3px 3px 7px rgba(57, 53, 44, 0.6))' }}
          />
        </IconButton>
        <Typography variant='h6'>Lisää uusi resepti!</Typography>
      </Stack>
    </Grid>
  );

  return (
    <Grid
      container
      direction='row'
      justifyContent='space-evenly'
      alignItems='center'
      width='100%'
      rowSpacing={2}
      marginTop={2}
      marginBottom={3}
    >
      {selectionControls}
      {filterControls}
      {newRecipeButton}
    </Grid>
  );
};

export default RecipesControlBar;

import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container, CircularProgress, Box } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import { SelectionFilter } from '../redux/slices/recipesSlice';
import { RecipesControlBar, RecipeGridItem } from '../components';
import { Recipe, RecipeTag } from '../types';
import filterBy from '../utils/RecipeFilterFunctions';

const Recipes = () => {
  const user = useAppSelector(state => state.auth.user);
  const { all: recipes, loadingMany: loading, selectionFilter } = useAppSelector(state => state.recipes);

  const [selection, setSelection] = useState<Recipe[]>([]);
  const [filteredSelection, setFilteredSelection] = useState<Recipe[] | null>(null);

  useEffect(() => {
    if (selectionFilter === SelectionFilter.all) setSelection(recipes);
    else if (selectionFilter === SelectionFilter.myRecipes) setSelection(recipes.filter(r => r.user.id === user?.id));
  }, [selectionFilter, recipes]);

  const filterSelection = (searchFilter?: string, tagFilters?: RecipeTag[]) => {
    if (searchFilter && !tagFilters)
      setFilteredSelection(selection.filter(recipe => filterBy.keyword(recipe, searchFilter)));
    else if (!searchFilter && tagFilters)
      setFilteredSelection(selection.filter(recipe => filterBy.tags(recipe, tagFilters)));
    else if (searchFilter && tagFilters)
      setFilteredSelection(
        selection.filter(recipe => filterBy.keyword(recipe, searchFilter) && filterBy.tags(recipe, tagFilters))
      );
    else setFilteredSelection(null);
  };

  const noRecipes = (
    <Box sx={{ widht: '100%', height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant='body1'>Ei reseptejä</Typography>
    </Box>
  );

  return loading ? (
    <CircularProgress color='secondary' />
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Container maxWidth='xl'>
        <RecipesControlBar onFilterChange={filterSelection} />
        {!filteredSelection && (
          <Grid container justifyContent='flex-start' rowSpacing={6} sx={{ mb: 5 }}>
            {selection.map(recipe => (
              <RecipeGridItem key={recipe.id} recipe={recipe} />
            ))}
          </Grid>
        )}
        {!filteredSelection && selection.length === 0 && noRecipes}
        {filteredSelection && (
          <Grid container justifyContent='flex-start' rowSpacing={6} sx={{ mb: 5 }}>
            {filteredSelection.map(recipe => (
              <RecipeGridItem key={recipe.id} recipe={recipe} />
            ))}
          </Grid>
        )}
        {filteredSelection && filteredSelection.length === 0 && noRecipes}
      </Container>
    </Box>
  );
};

export default Recipes;

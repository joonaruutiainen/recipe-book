import { Recipe, RecipeTag } from '../types';

const filterByKeyWord = (recipe: Recipe, keyword: string) =>
  Boolean(recipe.title.includes(keyword) || recipe.ingredients.find(ingr => ingr.description.includes(keyword)));

const filterByTags = (recipe: Recipe, tags: RecipeTag[]) =>
  Boolean(tags.every(tag => recipe.tags?.find(t => t.name === tag.name)));

const filterBy: {
  keyword: (recipe: Recipe, keyword: string) => boolean;
  tags: (recipe: Recipe, tags: RecipeTag[]) => boolean;
} = {
  keyword: filterByKeyWord,
  tags: filterByTags,
};

export default filterBy;

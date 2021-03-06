export interface RecipeDuration {
  hours: number;
  minutes: number;
}

export interface RecipeTag {
  name: string;
  color: string;
}

export interface RecipeSubtitle {
  index: number;
  name: string;
}

export interface RecipeIngredient {
  quantity?: number;
  unit?: string;
  description: string;
  subtitle?: RecipeSubtitle;
}

export interface RecipeStep {
  index: number;
  title: string;
  description: string;
  pageNumber: number;
}

export interface RecipeUser {
  id: string;
  name: string;
}

export interface Recipe {
  /**
   * ID of the recipe. IDs are automatically generated by MongoDB as Mongo ObjectId strings.
   */
  id: string;
  /**
   * Image ID of the recipe.
   */
  image?: string;
  /**
   * Title of the recipe (1 to 100 characters).
   */
  title: string;
  /**
   * Description of the recipe (1 to 1000 characters).
   */
  description: string;
  /**
   * Duration of the recipe as hours and minutes.
   */
  duration: RecipeDuration;
  /**
   * Associated tags that help browsing recipes by category.
   */
  tags?: [RecipeTag];
  /**
   * The amount of portions that comes from cooking the recipe with default ingredient quantities.
   */
  portionSize: number;
  /**
   * Recipe can be optionally divided into several subtitles (1 to 100 characters each).
   */
  subtitles?: [RecipeSubtitle];
  /**
   * The list of ingredients describing the quantities and names of the ingredients needed for cooking the recipe.
   * Each ingredient can be associated with a subtitle if recipe subtitles are provided.
   */
  ingredients: [RecipeIngredient];
  /**
   * The number of instruction pages in the recipe. By default each recipe start with having one page
   * of instructions, but more pages can be added.
   */
  pages: number;
  /**
   * The list of instructions steps describing the titles and verbal instructions for each step of the recipe.
   * Steps are indexed starting from 1 and can be divided over multiple instruction pages.
   */
  instructions: [RecipeStep];
  /**
   * True is the recipe is published, false otherwise. Publishing a recipe requires admin rights.
   */
  public: boolean;
  /**
   * The ID of the user who created the recipe.
   */
  user: RecipeUser;
}

export interface RecipeEditorData {
  id?: string;
  image?: File;
  title: string;
  description: string;
  duration: RecipeDuration;
  tags?: RecipeTag[];
  portionSize: number;
  subtitles?: RecipeSubtitle[];
  ingredients: RecipeIngredient[];
  pages: number;
  instructions: RecipeStep[];
  user: RecipeUser;
}

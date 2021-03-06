export interface User {
  /**
   * ID of the user. IDs are automatically generated by MongoDB as Mongo ObjectId strings.
   */
  id: string;
  /**
   * Name of the user.
   */
  name: string;
  /**
   * Email of the user.
   */
  email: string;
  /**
   * True if the user is marked as an admin, false otherwise.
   */
  admin: boolean;
  /**
   * The list of recipe IDs added to user favorites
   */
  favorites: string[];
}

export interface UserEditorData {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

export interface FavoritesEditorData {
  userId: string;
  recipeId: string;
  value: boolean;
}

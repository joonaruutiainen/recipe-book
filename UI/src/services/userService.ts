import { APIResponse, FavoritesEditorData, User, UserEditorData } from '../types';
import apiService from './apiService';

interface UserService {
  getUsers: () => Promise<APIResponse<User[]>>;
  getUser: (userId: string) => Promise<APIResponse<User>>;
  updateUser: (userData: UserEditorData) => Promise<APIResponse<User>>;
  updateUserFavorites: (data: FavoritesEditorData) => Promise<APIResponse<User>>;
}

const getUsers = () =>
  apiService.makeRequest({
    url: '/users',
    method: 'get',
  });

const getUser = (userId: string) =>
  apiService.makeRequest({
    url: `/users/${userId}`,
    method: 'get',
  });

const updateUser = (userData: UserEditorData) => {
  const { id, name, email, password, newPassword } = userData;
  return apiService.makeRequest({
    url: `/users/${id}`,
    method: 'put',
    data: { name, email, password, newPassword },
  });
};

const updateUserFavorites = (data: FavoritesEditorData) => {
  const { userId, recipeId, value } = data;
  return apiService.makeRequest({
    url: `/users/${userId}/updateFavorites/${recipeId}`,
    method: 'put',
    data: value ? { add: true } : { remove: true },
  });
};

const userService: UserService = {
  getUsers,
  getUser,
  updateUser,
  updateUserFavorites,
};

export default userService;

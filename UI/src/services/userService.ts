import { APIResponse, User, UserEditorData } from '../types';
import apiService from './apiService';

interface UserService {
  getUsers: () => Promise<APIResponse<User[]>>;
  getUser: (userId: string) => Promise<APIResponse<User>>;
  updateUser: (userData: UserEditorData) => Promise<APIResponse<User>>;
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

const userService: UserService = {
  getUsers,
  getUser,
  updateUser,
};

export default userService;

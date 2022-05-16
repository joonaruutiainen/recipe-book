import { APIResponse, UserEditorData } from '../types';
import apiService from './apiService';

interface UserService {
  getUsers: () => Promise<APIResponse>;
  getUser: (userId: string) => Promise<APIResponse>;
  updateUser: (userData: UserEditorData) => Promise<APIResponse>;
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
  const { id, name, email } = userData;
  return apiService.makeRequest({
    url: `/users/${id}`,
    method: 'put',
    data: { name, email },
  });
};

const userService: UserService = {
  getUsers,
  getUser,
  updateUser,
};

export default userService;

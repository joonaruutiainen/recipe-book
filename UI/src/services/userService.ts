import { APIResponse } from '../types';
import apiService from './apiService';

interface UserService {
  getUsers: () => Promise<APIResponse>;
  getUser: (userId: string) => Promise<APIResponse>;
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

const userService: UserService = {
  getUsers,
  getUser,
};

export default userService;

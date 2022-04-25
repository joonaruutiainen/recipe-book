import { APIResponse } from '../types';
import apiService from './apiService';

interface UserService {
  getUsers: () => Promise<APIResponse>;
}

const getUsers = () =>
  apiService.makeRequest({
    url: '/users',
    method: 'get',
  });

const userService: UserService = {
  getUsers,
};

export default userService;

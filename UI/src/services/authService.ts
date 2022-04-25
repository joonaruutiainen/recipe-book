import { APIResponse } from '../types';
import apiService from './apiService';

interface AuthService {
  initializeSession: () => Promise<APIResponse>;
  login: (identifier: string, password: string) => Promise<APIResponse>;
  logout: () => Promise<APIResponse>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<APIResponse>;
}

const initializeSession = async () =>
  apiService.makeRequest({
    url: '/',
    method: 'get',
  });

const login = async (identifier: string, password: string) =>
  apiService.makeRequest({
    url: '/login',
    method: 'post',
    data: {
      identifier,
      password,
    },
  });

const logout = async () =>
  apiService.makeRequest({
    url: '/logout',
    method: 'post',
  });

const register = async (name: string, email: string, password: string, confirmPassword: string) =>
  apiService.makeRequest({
    url: '/register',
    method: 'post',
    data: {
      name,
      email,
      password,
      confirmPassword,
    },
  });

const authService: AuthService = {
  initializeSession,
  login,
  logout,
  register,
};

export default authService;

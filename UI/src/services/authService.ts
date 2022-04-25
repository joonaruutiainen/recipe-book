import { APIResponse, LoginData, RegistrationData } from '../types';
import apiService from './apiService';

interface AuthService {
  initializeSession: () => Promise<APIResponse>;
  login: (userData: LoginData) => Promise<APIResponse>;
  logout: () => Promise<APIResponse>;
  register: (userData: RegistrationData) => Promise<APIResponse>;
}

const initializeSession = async () =>
  apiService.makeRequest({
    url: '/',
    method: 'get',
  });

const login = async (userData: LoginData) =>
  apiService.makeRequest({
    url: '/login',
    method: 'post',
    data: userData,
  });

const logout = async () =>
  apiService.makeRequest({
    url: '/logout',
    method: 'post',
  });

const register = async (userData: RegistrationData) =>
  apiService.makeRequest({
    url: '/register',
    method: 'post',
    data: userData,
  });

const authService: AuthService = {
  initializeSession,
  login,
  logout,
  register,
};

export default authService;

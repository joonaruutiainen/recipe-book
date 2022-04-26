import axios, { AxiosRequestConfig } from 'axios';
import { APIResponse } from '../types';
import { APIError } from '../types/APIError';
import ApplicationError from '../utils/ApplicationError';

axios.defaults.baseURL = 'http://localhost:8080/api/v1';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

interface APIService {
  makeRequest: (req: AxiosRequestConfig) => Promise<APIResponse>;
}

const makeRequest = async (req: AxiosRequestConfig): Promise<APIResponse> => {
  try {
    const res = await axios(req);
    const { data }: { data: APIResponse } = res;
    return await Promise.resolve(data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const { error }: { error: APIError } = err.response.data;
        return Promise.reject(new ApplicationError(error.message, err.response.status, error.details));
      }
      if (err.request) return Promise.reject(new ApplicationError('Recipebook API is unavailable', 500));
      return Promise.reject(new ApplicationError(err.message, parseInt(err.code!, 10) || 500));
    }
    return Promise.reject(new ApplicationError('Unable to send API request', 500));
  }
};

const apiService: APIService = {
  makeRequest,
};

export default apiService;

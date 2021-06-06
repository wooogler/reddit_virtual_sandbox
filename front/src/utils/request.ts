import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const request = <T>({
  ...options
}: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  // const client = axios.create({ baseURL: 'http://143.248.48.96:8887/' });
  const client = axios.create({ baseURL: 'http://localhost:8000/' });
  const token = localStorage.getItem('token');
  if (token) {
    client.defaults.headers.common.Authorization = `Token ${token}`;
  }

  const onSuccess = (response: any) => response;
  const onError = (error: any) => {
    return error;
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;

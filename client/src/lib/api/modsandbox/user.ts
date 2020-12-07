import axios from 'axios';
import { LoginForm } from '../../../modules/user/slice';

export async function loginAPI(username: string, password: string) {
  const response = await axios.post<{ key: string }>(
    'http://localhost:8000/rest-auth/login/',
    {
      username,
      password,
    },
  );

  return response.data.key;
}

export async function logoutAPI(token: string) {
  await axios.post<string>('http://localhost:8000/rest-auth/logout/', null, {
    headers: { Authorization: `Token ${token}` },
  });

  return;
}

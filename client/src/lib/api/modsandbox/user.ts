import axios from 'axios';

export async function loginAPI(username: string, password: string) {
  const response = await axios.post<{ key: string }>('/rest-auth/login/', {
    username,
    password,
  });

  return response.data.key;
}

export async function logoutAPI(token: string) {
  await axios.post('/rest-auth/logout/', null, {
    headers: { Authorization: `Token ${token}` },
  });

  return;
}

export async function getUserInfoAPI(token: string) {
  const response = await axios.get<any>('/rest-auth/user/', {
    headers: { Authorization: `Token ${token}` },
  });

  const logResponse = await axios.get<string>('/reddit_logged', {
    headers: { Authorization: `Token ${token}` },
  });

  return { ...response.data, reddit_logged: logResponse.data };
}

export async function signupAPI(username: string, password: string) {
  const response = await axios.post<{ key: string }>(
    '/rest-auth/registration/',
    {
      username,
      password1: password,
      password2: password,
    },
  );

  return response.data.key;
}

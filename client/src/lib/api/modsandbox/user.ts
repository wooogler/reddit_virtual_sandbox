import axios from 'axios';

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
  await axios.post('http://localhost:8000/rest-auth/logout/', null, {
    headers: { Authorization: `Token ${token}` },
  });

  return;
}

export async function getUserInfoAPI(token: string) {

  const response = await axios.get<any>('http://localhost:8000/rest-auth/user/', {
    headers: { Authorization: `Token ${token}` }
  })

  const logResponse = await axios.get<string>('http://localhost:8000/reddit_logged', {
    headers: { Authorization: `Token ${token}` }
  })

  return {...response.data, reddit_logged: logResponse.data} 
}

export async function signupAPI(username: string, password: string) {
  const response = await axios.post<{ key: string }>(
    'http://localhost:8000/rest-auth/registration/',
    {
      username,
      password1: password,
      password2: password,
    },
  )

  return response.data.key;
}
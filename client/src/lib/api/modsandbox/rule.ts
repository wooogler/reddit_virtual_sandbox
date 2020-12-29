import axios from 'axios';

export async function submitCodeAPI(token: string, code: string) {
  const response = await axios.post(
    'http://localhost:8000/apply_rules/',
    {
      yaml: code,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  return response.data;
}

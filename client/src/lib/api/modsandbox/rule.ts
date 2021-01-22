import axios from 'axios';

export async function submitCodeAPI(token: string, code: string) {
  const response = await axios.post(
    '/apply_rules/',
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

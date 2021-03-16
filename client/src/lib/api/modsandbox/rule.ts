import axios from 'axios';

export async function submitCodeAPI(token: string, code: string, multiple: boolean) {
  const response = await axios.post(
    '/apply_rules/',
    {
      yaml: code,
      multiple,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  return response.data;
}

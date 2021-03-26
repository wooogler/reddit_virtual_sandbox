import axios from 'axios';

export async function submitCodeAPI(
  token: string,
  code: string,
  multiple: boolean,
) {
  const noCode = code === '';
  const response = await axios.post(
    '/apply_rules/',
    {
      yaml: code,
      multiple,
      no_code: noCode,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  return response.data;
}

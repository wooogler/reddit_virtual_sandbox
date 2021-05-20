import axios from 'axios';

const fetcher = async ({ queryKey }: { queryKey: string }) => {
  const response = await axios.get(queryKey);
  return response.data;
};

export default fetcher;

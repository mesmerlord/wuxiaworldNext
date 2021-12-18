import axios from 'axios';
import { useQuery } from 'react-query';

const apiHome = process.env.NEXT_PUBLIC_API_HOME;

const chapterFetch = ({ queryKey }) => {
  const [_, id] = queryKey;

  return axios
    .get(`${apiHome}/chapters/${id}/`, {})
    .then((response) => {
      const res = response.data;
      return res;
    })
    .catch((error) => error);
};
const useChapters = (id) => {
  return useQuery(['chapters', id], chapterFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
export { useChapters, chapterFetch };

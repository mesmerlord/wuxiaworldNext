import axios from "axios";
import { useQuery } from "react-query";
// import { toast } from 'react-toastify';

const apiHome = process.env.NEXT_PUBLIC_API_HOME;

const novelInfoFetch = ({ queryKey }) => {
  const [_, id] = queryKey;
  const link = `${apiHome}/novels/${id}/`;
  return axios.get(link).then((response) => {
    const res = response.data;
    return res;
  });
};
const useNovel = (slug) => {
  return useQuery(["novelInfo", slug], novelInfoFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: Infinity,
    // onError: (error) => {
    //   toast.error(
    //     'This Novel URL has probably been moved, please use search bar to find the novel and try again'
    //   );
    //   // setTimeout(() => {
    //   //   // redirectHome();
    //   // }, 4000);
    // },
  });
};
export { useNovel, novelInfoFetch };

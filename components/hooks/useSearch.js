import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const searchFetch = ({ pageParam = 0, queryKey }) => {
  const [_, searchQuery, orderBy, setHasNextPage, setResultCount] = queryKey;

  let link = `${apiHome}/search/?limit=12&offset=${
    pageParam * 12
  }&search=${searchQuery}`;
  if (orderBy) {
    link = link + `&order=${orderBy}`;
  }
  const results = axios.get(link).then((res) => {
    const novels = res.data.results;
    setHasNextPage(res.data.next);
    setResultCount(res.data.count);
    return novels;
  });
  return results;
};

const useSearch = ({
  searchQuery,
  orderBy,
  pageNum,
  setHasNextPage,
  setResultCount,
}) => {
  return useInfiniteQuery(
    ["searchNovels", searchQuery, orderBy, setHasNextPage, setResultCount],
    searchFetch,
    {
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => {
        return pageNum + 1;
      },
      staleTime: Infinity,
    }
  );
};
export { searchFetch, useSearch };

import { useEffect, useState } from "react";

import {
  TextInput,
  Loader,
  Button,
  Group,
  Center,
  Container,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/router";
import Background from "../../components/Background/Background";
import { routes } from "../../components/utils/Routes";
import { useStore } from "../../components/Store/StoreProvider";
import Seo from "../../components/common/Seo";
import OrderFilter from "../../components/common/OrderFilter";
import NewNovelSection from "../../components/common/NewNovelSection";
import { QueryClient } from "react-query";
import { useSearch } from "../../components/hooks/useSearch";

// export async function getServerSideProps(context) {
//   const { slug } = context.params;
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(["chapterFetch", slug], chapterFetch, {
//     staleTime: Infinity,
//   });
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }
const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [pageNum, setPageNum] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchQuery1, setSearchQuery1] = useState(query || "");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  const [ascending, setAscending] = useState(true);
  const [orderBy, setOrderBy] = useState("");
  const [exactRating, setExactRating] = useState(null);
  const [exactTag, setExactTag] = useState("");
  const [exactCategory, setExactCategory] = useState("");
  const [ratingHigherThan, setRatingHigherThan] = useState(0);
  const [ratingLessThan, setRatingLessThan] = useState(5);
  const [numOfChapsHigherThan, setNumOfChapsHigherThan] = useState(0);
  const [numOfChapsLessThan, setNumOfChapsLessThan] = useState(0);
  const { data, error, fetchNextPage, isFetchingNextPage, status, isFetching } =
    useSearch({
      searchQuery,
      orderBy,
      pageNum,
      setHasNextPage,
      setResultCount,
    });

  useEffect(() => {
    setPageNum(0);
    if (query && query != searchQuery) {
      setSearchQuery(query);
    }
  }, [query]);

  useEffect(() => {
    setPageNum(0);
    if (searchQuery && searchQuery.length > 0) {
      router.push(
        `${routes.search}${searchQuery}`,
        `${routes.search}${searchQuery}`,
        { shallow: true }
      );
    }
  }, [searchQuery, orderBy]);

  useEffect(() => {
    fetchNextPage();
  }, [pageNum]);

  const handleQueryChange = (e) => {
    setPageNum(0);

    setSearchQuery1(e.target.value);
  };

  const buttonClick = () => {
    setPageNum(pageNum + 1);
  };

  const searchNow = () => {
    setSearchQuery(searchQuery1);
  };

  return (
    <Background>
      <Seo
        title={`Search Page - Find Your Favorite Novels at ${process.env.REACT_APP_SITE_NAME}`}
        description={`Search for more ${searchQuery} novels at ${siteName} for free on ${siteUrl}`}
        url={`${siteUrl}${routes.search}`}
        image={""}
        loading={false}
      />

      <Container>
        <Center>
          <Group>
            <TextInput
              size="lg"
              value={searchQuery1}
              placeholder="Search"
              onChange={handleQueryChange}
              rightSection={
                isFetching ? <Loader variant="oval" size="xs" /> : null
              }
            />
            <Button onClick={searchNow} leftIcon="🔎" size="lg">
              Search
            </Button>
          </Group>
        </Center>
        <OrderFilter setOrderBy={setOrderBy} orderBy={orderBy} />
        <NewNovelSection
          novelList={data ? data.pages : null}
          headingText={`${resultCount} Results Found For '${searchQuery}'`}
        />
      </Container>
      {hasNextPage ? (
        <Center>
          <Button
            style={{ margin: "30px" }}
            rightIcon={isFetching && <Loader />}
            onClick={buttonClick}
          >
            Load More
          </Button>
        </Center>
      ) : !resultCount ? (
        <Title order={3} align="center" style={{ marginTop: "50px" }}>
          No Results Found
        </Title>
      ) : (
        <Title order={4} align="center" style={{ marginTop: "50px" }}>
          <Text>End of results</Text>
        </Title>
      )}
    </Background>
  );
};

export default SearchPage;

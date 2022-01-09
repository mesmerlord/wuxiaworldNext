// import {
//   Container,
//   Paper,
//   Card,
//   Group,
//   Button,
//   Title,
//   Text,
// } from "@mantine/core";
import Background from "../../components/Background/Background";
import { useStore } from "../../components/Store/StoreProvider";
import { dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { novelInfoFetch, useNovel } from "../../components/hooks/useNovel";
import MobileDetail from "../../components/PageSpecific/NovelDetail/MobileDetail";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch, {
    staleTime: Infinity,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const NovelDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: novelData } = useNovel(slug);
  // const { data: chapterData } = useChapters(slug);

  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const darkMode = useStore((state) => state.darkMode);

  const toggleDark = () => {
    toggleDarkMode(!darkMode);
  };

  return (
    <Background>
      <MobileDetail
        novelData={novelData}
        // bookmarked={bookmarkData?.created_at && !bookmarkError}
        // addNovelBookmark={addNovelBookmark}
        // removeNovelBookmark={removeNovelBookmark}
        // bookmarkData={bookmarkData}
        // id={id}
      />
    </Background>
  );
};

export default NovelDetail;

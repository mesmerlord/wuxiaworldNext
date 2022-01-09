import Background from "../../components/Background/Background";
import { dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { novelInfoFetch, useNovel } from "../../components/hooks/useNovel";
import MobileDetail from "../../components/PageSpecific/NovelDetail/MobileDetail";
import dynamic from "next/dynamic";
import { Container } from "@mantine/core";
import useInView from "react-cool-inview";
import Seo from "../../components/common/Seo.js";
import { routes } from "../../components/utils/Routes";
import { useStore } from "../../components/Store/StoreProvider";

const DisqusComments = dynamic(() =>
  import("../../components/common/DisqusComments")
);
const Recommendations = dynamic(() =>
  import("../../components/PageSpecific/NovelDetail/Recommendations")
);

const SSR = typeof window === "undefined";

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

const NovelDetail = (props) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: novelData } = useNovel(slug);
  const siteName = useStore((state) => state.siteName);

  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    threshold: 0,

    onEnter: ({ unobserve }) => {
      unobserve();
    },
  });
  const { observe: recommendationObserve, inView: recommendationView } =
    useInView({
      threshold: 0.1, // Default is 0

      onEnter: ({ unobserve }) => {
        unobserve();
      },
    });
  return (
    <Background>
      <Seo
        url={`${routes.novel}${novelData.slug}`}
        image={`${novelData.image}`}
        title={`${novelData.name} - Read Wuxia Novels at ${siteName}`}
        description={`You are reading ${novelData?.name} online for free on ${siteName}. Read ${novelData?.name} and more Wuxia, Xuanhuan, Korean and Japanese novels at ${siteName}. Continue reading . ${novelData?.description}`}
        loading={false}
      />
      <MobileDetail
        novelData={novelData}
        // bookmarked={bookmarkData?.created_at && !bookmarkError}
        // addNovelBookmark={addNovelBookmark}
        // removeNovelBookmark={removeNovelBookmark}
        // bookmarkData={bookmarkData}
        id={slug}
      />
      <Container
        sx={{ maxWidth: "700px", position: "relative" }}
        ref={recommendationObserve}
      >
        <Container size="md" ref={observe}>
          {inView && <DisqusComments slug={`${novelData?.slug}`} />}
        </Container>
        <Recommendations novel_slug={slug} />
        <br />
      </Container>
    </Background>
  );
};

export default NovelDetail;

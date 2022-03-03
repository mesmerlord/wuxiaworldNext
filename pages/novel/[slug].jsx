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
import { useEffect } from "react";
// import { getSession, useSession } from "next-auth/react";
import axios from "axios";
const DisqusComments = dynamic(
  () => import("../../components/common/DisqusComments"),
  {
    ssr: false,
  }
);
const Recommendations = dynamic(
  () => import("../../components/PageSpecific/NovelDetail/Recommendations"),
  {
    ssr: false,
  }
);

const SSR = typeof window === "undefined";

export async function getStaticPaths() {
  let urls = [];
  let first_url = await axios.get("https://wuxianovels.co/api/novels/");
  let has_next = true;
  while (has_next) {
    if (!first_url.data.next) {
      has_next = false;
    }
    let temp_urls = first_url.data.results.map((item) => {
      const value = { params: { slug: item.slug } };
      return value;
    });
    urls = [...temp_urls, ...urls];
    first_url = await axios.get(first_url.data.next);
  }

  return {
    paths: [...urls],
    fallback: true, // false or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch, {
    staleTime: Infinity,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 48,
  };
}

// export async function getServerSideProps(context) {
//   // const { req } = context;
//   const { slug } = context.params;

//   // const session = await getSession({ req });
//   // if (session) {
//   //   axios.defaults.headers.common[
//   //     "Authorization"
//   //   ] = `Token ${session.user.accessToken}`;
//   // }

//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch, {
//     staleTime: Infinity,
//   });
//   // console.log(dehydrate(queryClient));
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

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
        url={`${routes.novel}${novelData?.slug}`}
        image={`${novelData?.image}`}
        title={`${novelData?.name} - Read Wuxia Novels at ${siteName}`}
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

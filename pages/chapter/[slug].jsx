import Script from "next/script";
import { useRouter } from "next/router";
import { chapterFetch, useChapter } from "../../components/hooks/useChapter";
import { useStore } from "../../components/Store/StoreProvider";
import DisqusComments from "../../components/common/DisqusComments";
import useInView from "react-cool-inview";
import { Container } from "@mantine/core";
import dynamic from "next/dynamic";
import ChapterView from "../../components/PageSpecific/Chapter/ChapterView";
import { dehydrate, QueryClient } from "react-query";
import { routes } from "../../components/utils/Routes.js";
import Seo from "../../components/common/Seo";

// const ChapterView = dynamic(
//   () => import("../../components/PageSpecific/Chapter/ChapterView"),
//   {
//     ssr: false,
//     loading: () => <BackgroundLoading />,
//   }
// );
const Recommendations = dynamic(
  () => import("../../components/common/Recommendations"),
  {
    ssr: false,
  }
);

export async function getStaticPaths() {
  const headers = {
    Authorization: `Token ${process.env.ADMIN_TOKEN}`,
  };
  const response = await axios.get(
    "https://wuxia.click/api/admin-novels/?order=-total_views",
    {
      headers,
    }
  );
  const urls = response.data.slice(0, 50).map((item) => {
    const value = { slug: item.slug };
    return value;
  });
  const chapter_urls = urls.map(async (url) => {
    const chapter_fetch = async (id) => {
      return await axios
        .get(`${apiHome}/chapters/${id}/`, {})
        .then((response) => {
          const res = response.data;
          return res;
        })
        .catch((error) => error);
    };

    fetched_chapters = await chapter_fetch(url);
    first_chaps_to_download = fetched_chapters.slice(0, 50);
    second_chaps_to_download = fetched_chapters.slice(-50);

    all_chaps = [...first_chaps_to_download, ...second_chaps_to_download];
    paths_to_return = all_chaps.map((chap) => {
      return { slug: chap.novSlugChapSlug };
    });
    return paths_to_return;
  });

  flattened_array = [].concat.apply([], chapter_urls);
  flattened_array.map((chapter) => {
    return {
      params: { slug: item.slug },
    };
  });

  return {
    paths: [...urls],
    fallback: "blocking", // false or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["chapterFetch", slug], chapterFetch, {
    staleTime: Infinity,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
const Chapter = (props) => {
  const router = useRouter();

  const { observe, inView } = useInView({
    threshold: 0.5,
    onEnter: ({ unobserve }) => {
      unobserve();
    },
  });
  const { slug } = router.query;
  const { data, isLoading } = useChapter(slug);

  const siteUrl = useStore((state) => state.siteUrl);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5752282235723884"
        crossorigin="anonymous"
      />
      <Seo
        description={`You're reading ${data?.title} - ${data?.novelParentName} for free on ${siteUrl}, continue reading `}
        url={`${siteUrl}${routes.chapter}${data?.novelParent}-${data?.index}`}
        title={`${data?.title} : ${data?.novelParentName} - Read at Wuxiaworld EU`}
        image={""}
        loading={false}
      />
      <ChapterView chapterSlug={slug} />
      <Container sx={{ maxWidth: "700px", position: "relative" }}>
        <Container size="md" ref={observe}>
          {inView && <DisqusComments slug={`${slug}`} />}
        </Container>
        {!isLoading && (
          <>
            <Container ref={observe}>
              {inView && (
                <DisqusComments slug={`${data?.novelParent}-${data?.index}`} />
              )}
            </Container>
            <br />
            <br />

            <Container
              sx={{
                maxWidth: "700px",
              }}
            >
              {inView && <Recommendations novel_slug={data?.novelParent} />}
            </Container>
            <br />
          </>
        )}
        <br />
      </Container>
    </>
  );
};

export default Chapter;

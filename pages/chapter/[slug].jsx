import Script from "next/script";
import { useRouter } from "next/router";
import { chapterFetch, useChapter } from "../../components/hooks/useChapter";
import { useStore } from "../../components/Store/StoreProvider";
import DisqusComments from "../../components/common/DisqusComments";
import useInView from "react-cool-inview";
import { Container } from "@mantine/core";
import dynamic from "next/dynamic";
import BackgroundLoading from "../../components/Background/BackgroundLoading";
import ChapterView from "../../components/PageSpecific/Chapter/ChapterView";
import { dehydrate, QueryClient } from "react-query";

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
export async function getServerSideProps(context) {
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
      {/* <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5752282235723884"
        crossorigin="anonymous"
      /> */}
      {/* <Seo
        description={`You're reading ${chapterData.title} - ${chapterData.novelParentName} for free on ${siteUrl}, continue reading `}
        url={`${siteUrl}${routes.chapter}${chapterData.novelParent}-${chapterData.index}`}
        title={`${chapterData.title} - Read at Wuxiaworld EU`}
        image={""}
        loading={false}
      /> */}

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

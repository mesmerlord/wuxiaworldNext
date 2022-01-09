import ChapterView from "../../components/PageSpecific/Chapter/ChapterView";
import Script from "next/script";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { chapterFetch, useChapter } from "../../components/hooks/useChapter";
import Seo from "../../components/common/Seo";
import { useStore } from "../../components/Store/StoreProvider";
import DisqusComments from "../../components/common/DisqusComments";
import { Recommendations } from "disqus-react";
import useInView from "react-cool-inview";
import { Container } from "@mantine/core";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  console.log(slug);

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

  const { slug } = router.query;
  const { data } = useChapter(slug);

  const siteUrl = useStore((state) => state.siteUrl);
  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    threshold: 0,

    onEnter: ({ unobserve }) => {
      unobserve();
    },
  });
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
        <Recommendations novel_slug={slug} />
        <br />
      </Container>
    </>
  );
};

export default Chapter;

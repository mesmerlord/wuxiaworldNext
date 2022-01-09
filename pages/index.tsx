import { Container } from "@mantine/core";
import { dehydrate, QueryClient } from "react-query";
import Sections from "../components/common/Sections";
import { novelsFetch, useNovels } from "../components/hooks/useNovels";
import Head from "next/head";
import dynamic from "next/dynamic";
import BackgroundLoading from "../components/Background/BackgroundLoading";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
const RecentlyUpdated = dynamic(
  () => import("../components/common/RecentlyUpdated.js"),
  { loading: () => <BackgroundLoading /> }
);

const getAbsoluteURL = (path) => {
  return `https://${process.env.VERCEL_URL}` + path;
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["home_view"], novelsFetch, {
    staleTime: Infinity,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 3,
  };
}

export default function HomePage({ dehydratedState }) {
  const title = `${siteName} - Read Chinese, Korean and Japanese Novels`;
  const description = `${siteName} has the latest translations of your favorite Chinese, Japanese, Korean - Light Novels and Web Novels. All Chapters Are Updated Daily and New Novels Added Very Frequently.`;
  const { data } = useNovels();

  return (
    <>
      <Head>
        <title>{`${siteName} - Read Chinese, Korean and Japanese Novels`}</title>
        <meta name="description" content={description} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={`${siteName}`} />
        <meta name="twitter:label1" content="Est reading time" />
        <meta name="twitter:data1" content="5 minutes" />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={getAbsoluteURL("apple-touch-icon.png")}
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Container>
        {data?.map((category: any) => (
          <Sections
            categoryName={category.name}
            novelList={category.novels}
            categorySlug={category.slug}
          />
        ))}
        <RecentlyUpdated />
      </Container>
    </>
  );
}

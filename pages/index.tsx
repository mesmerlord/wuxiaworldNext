import { Container } from "@mantine/core";
import { dehydrate, QueryClient } from "react-query";
import Sections from "../components/common/Sections";
import { novelsFetch, useNovels } from "../components/hooks/useNovels";
import Head from "next/head";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME;
const getAbsoluteURL = (path) => {
  const baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return baseURL + path;
};
export default function HomePage() {
  const { data } = useNovels();
  const title = `${siteName} - Read Chinese, Korean and Japanese Novels`;
  const description = `${siteName} has the latest translations of your favorite Chinese, Japanese, Korean - Light Novels and Web Novels. All Chapters Are Updated Daily and New Novels Added Very Frequently.`;
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
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["novelInfo"], novelsFetch);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

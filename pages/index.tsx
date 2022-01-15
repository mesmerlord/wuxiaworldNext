import { Container } from "@mantine/core";
import { dehydrate, QueryClient } from "react-query";
import Sections from "../components/common/Sections";
import { novelsFetch, useNovels } from "../components/hooks/useNovels";
import Head from "next/head";
import dynamic from "next/dynamic";
import BackgroundLoading from "../components/Background/BackgroundLoading";
import Seo from "../components/common/Seo";
import { useStore } from "../components/Store/StoreProvider";

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
  const { data } = useNovels();
  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  return (
    <>
      <Seo
        description={`${siteName} has the latest translations of your favorite Chinese, Japanese, Korean - Light Novels and Web Novels. All Chapters Are Updated Daily and New Novels Added Very Frequently.`}
        url={`${siteUrl}`}
        title={`${siteName} - Read Chinese, Korean and Japanese Novels`}
        image={""}
        loading={false}
      />

      <Container>
        {data?.map((category: any) => (
          <Sections
            categoryName={category.name}
            novelList={category.novels}
            categorySlug={category.slug}
            key={category.slug}
          />
        ))}
        <RecentlyUpdated />
      </Container>
    </>
  );
}

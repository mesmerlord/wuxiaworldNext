import { Container } from "@mantine/core";
import { dehydrate, QueryClient } from "react-query";
import Sections from "../components/common/Sections";
import { novelsFetch, useNovels } from "../components/hooks/useNovels";

export default function HomePage() {
  const { data } = useNovels();

  return (
    <>
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

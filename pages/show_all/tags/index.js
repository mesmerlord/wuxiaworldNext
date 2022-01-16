import { Badge, Card, Container, Title } from "@mantine/core";
import { tagsFetch, useTags } from "../../../components/hooks/useTags";
import { useStore } from "../../../components/Store/StoreProvider";

import Background from "../../../components/Background/Background";
import LinkText from "../../../components/common/LinkText";
import Sections from "../../../components/common/Sections";
import Seo from "../../../components/common/Seo";
import { routes } from "../../../components/utils/Routes";
import { dehydrate, QueryClient } from "react-query";

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["tags_list"], tagsFetch, {
    staleTime: Infinity,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 48,
  };
}
const Tags = () => {
  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  const { isLoading, error, data, isFetching } = useTags();
  return (
    <Background>
      <Seo
        description={`Discover Your Favorite Novel Tags. ${siteName} has the latest translations of your favorite Chinese, Japanese, Korean - Light Novels and Web Novels. All Chapters Are Updated Daily and New Novels Added Very Frequently.`}
        url={`${siteUrl}${routes.tags}`}
        title={`Discover Your Favorite Novel Tags - ${siteName}`}
        image={""}
        loading={false}
      />
      <Container>
        <Card>
          <Title order={1} align="center" style={{ margin: "10px" }}>
            All Tags
          </Title>
          <Container>
            {data?.tags?.map((item) => (
              <LinkText to={`${routes.tag}${item.slug}`}>
                <Badge
                  key={item.name}
                  variant="filled"
                  size="md"
                  style={{ cursor: "pointer", margin: "3px" }}
                >
                  {item.name}
                </Badge>
              </LinkText>
            ))}
          </Container>
        </Card>
        <Title order={1} align="center" style={{ margin: "10px" }}>
          Most Viewed Tags
        </Title>

        {data?.results?.map((tag) => (
          <Sections
            categoryName={tag.name}
            novelList={tag.novels}
            categorySlug={tag.slug}
          />
        ))}
      </Container>
    </Background>
  );
};

export default Tags;

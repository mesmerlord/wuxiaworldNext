import {
  Container,
  Paper,
  Card,
  Group,
  Button,
  Title,
  Text,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import Background from "../../components/Background/Background";
import { useStore } from "../../components/Store/StoreProvider";
import { dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { novelInfoFetch, useNovel } from "../../components/hooks/useNovel";
import { chapterFetch, useChapters } from "../../components/hooks/useChapters";
import ChapterBox from "./ChapterBox";
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const NovelDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: novelData } = useNovel(slug);
  const { data: chapterData } = useChapters(slug);

  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const darkMode = useStore((state) => state.darkMode);

  const toggleDark = () => {
    toggleDarkMode(!darkMode);
  };

  return (
    <Background>
      <Container size="xl" padding="xl">
        <Button onClick={toggleDark}> Dark </Button>
        <Card padding="xl">
          <Group
            direction="column"
            position="center"
            spacing="xl"
            styles={{
              child: { marginBottom: "20px" },
            }}
          >
            <Title order={1} style={{ fontSize: 15 }}>
              You Are Reading {novelData && novelData.name}
            </Title>
            <Image
              src={`${novelData?.image}`}
              alt={novelData?.name}
              width={100}
              height={100}
            />
            {novelData && (
              <Group
                direction="column"
                position="center"
                spacing="xl"
                styles={{
                  child: { marginBottom: "20px" },
                }}
              >
                <Title order={2}>{novelData.name}</Title>

                <Title order={5}>Views - {novelData.views}</Title>
                <Container size="sm">
                  <Group
                    styles={{
                      child: { marginRight: "20px" },
                    }}
                  >
                    <Title order={5}>Category - </Title>
                    {/* {categories} */}
                  </Group>
                </Container>

                <Container size="sm">
                  {/* <Title order={5}>Tags - {tags}</Title> */}
                </Container>
                <br />
                <Title order={5}>Author - {novelData.author.name}</Title>
                <br />
                <Container size="md">
                  <Text size="lg">{novelData.description}</Text>
                </Container>
              </Group>
            )}
          </Group>
        </Card>
      </Container>
      {/* <Container>
        {chapterData ? (
          <ChapterBox chapters={chapterData} />
        ) : (
          <Card sx={{ height: '200px', width: '200px' }}></Card>
        )}
      </Container> */}
    </Background>
  );
};

export default NovelDetail;

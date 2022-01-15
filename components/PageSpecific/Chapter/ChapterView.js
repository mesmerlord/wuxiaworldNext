import React, { useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { apiHome } from "../../utils/siteName.js";
import { useWindowScroll } from "@mantine/hooks";
import {
  Center,
  Paper,
  Container,
  Text,
  Button,
  Breadcrumbs,
  Group,
  Title,
  Affix,
  Transition,
} from "@mantine/core";
import { useQuery, useQueryClient } from "react-query";
import Background from "../../Background/Background.js";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
// import GoogleAd from "../../components/common/GoogleAd.js";
import { useMediaQuery } from "@mantine/hooks";
import BackgroundLoading from "../../Background/BackgroundLoading.js";
import ReactGA from "react-ga";
import Buttons from "../../common/Buttons.js";
import GoogleAdSmall from "../../common/GoogleAdSmall.js";
import Seo from "../../common/Seo.js";
import GoogleAdMobile from "../../common/GoogleAdMobile.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useStore } from "../../Store/StoreProvider.js";
import LinkText from "../../common/LinkText.js";
import { routes } from "../../utils/Routes.js";
import { useChapter, chapterFetch } from "../../hooks/useChapter.js";

const ChapterView = ({ chapterSlug }) => {
  const router = useRouter();
  const [scroll, scrollTo] = useWindowScroll();
  const queryClient = useQueryClient();
  const accessToken = useStore((state) => state.accessToken);
  const changeSettings = useStore((state) => state.changeSettings);
  const fontSize = useStore((state) => state.fontSize);
  const phone = useMediaQuery("(max-width: 1024px)");
  const { data } = useChapter(chapterSlug);

  useEffect(() => {
    if (data?.nextChap) {
      queryClient.prefetchQuery(
        ["chapterFetch", `${data?.novelParent}-${data?.nextChap}`],

        chapterFetch,
        { staleTime: 100000 }
      );
    }
    if (data && data?.novelParentName) {
      ReactGA.event({
        category: "Novel View",
        action: "Chapter View",
        label: `${data?.novelParentName}`,
        value: `${data?.title}`,
      });
    }
  }, [data]);

  const addBookmark = () => {
    if (!chapterSlug) {
      return;
    }
    if (!accessToken) {
      router.push(routes.login);
    }
    const link = `${apiHome}/bookmark/`;
    const params = { novSlugChapSlug: chapterSlug };
    axios
      .post(link, params)
      .then((response) => {
        const res = response.data;
        // toast.info("Your Novel Bookmark has been updated");
      })
      .catch((err) => {
        // toast.error("Couldn't update your bookmark");
      });
  };

  const chapterParts = data?.text?.split("\n").map((text, index) => (
    <div key={index}>
      <Text
        id="chapterText"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.8em",
          marginTop: "1em",
        }}
      >
        {text}
      </Text>
      {index % 15 == 0 && !phone && (
        <GoogleAdSmall pageParam={chapterSlug} adNum={index} />
      )}
      {index % 12 == 0 && phone && (
        <GoogleAdMobile pageParam={chapterSlug} adNum={index} />
      )}
    </div>
  ));

  return (
    <Background>
      <Container>
        <div>
          <Breadcrumbs style={{ marginBottom: "40px" }}>
            <LinkText href={routes.home}>
              <Text size="xl">Home</Text>
            </LinkText>
            {data && (
              <LinkText
                style={{ whiteSpace: "nowrap" }}
                href={`${routes.novel}${data.novelParent}`}
              >
                <Text size="xl">{data && data.novelParentName}</Text>
              </LinkText>
            )}
          </Breadcrumbs>
          {data && (
            <>
              <Center>
                <Title order={1} transform="uppercase">
                  {data.title}
                </Title>
              </Center>
              <br />

              <Buttons
                key={data?.index}
                novelParent={data?.novelParent}
                nextChapter={data?.nextChap}
                prevChapter={data?.prevChap}
                chapterIndex={data?.index}
              />
            </>
          )}
        </div>
      </Container>
      <Container>
        <div style={{ overflowWrap: "break-word" }}>
          <Paper
            radius={0}
            shadow="md"
            style={phone ? { padding: "10px 5px" } : { padding: "40px 15px" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Group>
                <Button
                  onClick={() => {
                    if (fontSize < 40) {
                      changeSettings({ fontSize: fontSize + 1 });
                    }
                  }}
                  radius="lg"
                  size="xs"
                >
                  A+
                </Button>
                <Button
                  onClick={() => {
                    if (fontSize > 10) {
                      changeSettings({ fontSize: fontSize - 1 });
                    }
                  }}
                  radius="lg"
                  size="xs"
                >
                  A-
                </Button>
                {data && (
                  <Button
                    onClick={addBookmark}
                    size="xs"
                    leftIcon={<ChromeReaderModeIcon />}
                  >
                    Mark Read
                  </Button>
                )}
              </Group>
            </div>
            {!data?.text ? (
              <Container sx={{ position: "relative" }}>
                <BackgroundLoading />
              </Container>
            ) : (
              <>{chapterParts}</>
            )}
          </Paper>
        </div>
        <br />

        {data && (
          <>
            <Buttons
              key={data.index}
              novelParent={data.novelParent}
              nextChapter={data.nextChap}
              prevChapter={data.prevChap}
              chapterIndex={data.index}
            />
          </>
        )}
      </Container>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
              ↑
            </Button>
          )}
        </Transition>
      </Affix>

      <br />

      <br />
      <br />
    </Background>
  );
};

export default ChapterView;

import {
  Divider,
  Text,
  Group,
  Title,
  Container,
  Center,
  Checkbox,
  Box,
  Skeleton,
  ActionIcon,
  Pagination,
  Button,
  NumberInput,
} from "@mantine/core";
import LinkText from "../../components/common/LinkText.js";
import { routes } from "../../utils/Routes";
import { useStore } from "../../Store/Store.js";
import React, { Suspense, useState, lazy, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useUpdateBookmark } from "../../hooks/useBookmark.js";
import { useNotifications } from "@mantine/notifications";
import { useChapters } from "../../hooks/useChapters.js";
import { useHistory } from "react-router-dom";
import NewCard from "../../components/common/NewCard.js";
const ChaptersModal = lazy(() =>
  import("../../components/common/ChaptersModal")
);
function ChapterBox({ lastReadIndex, novelParent, desktop, bookmarkData }) {
  const [goChapter, setGoChapter] = useState(null);

  const loggedIn = useStore((state) => state.accessToken);
  const phone = useMediaQuery("(max-width: 768px)");
  const notifications = useNotifications();
  const [page, setPage] = useState(1);
  const [descending, setDescending] = useState(false);
  const [chapters, setChapters] = useState();
  const [lastRead, setLastRead] = useState(lastReadIndex);

  const { isLoading, error, data, refetch } = useChapters(novelParent);
  const history = useHistory();

  const changeOrdering = () => {
    setDescending(!descending);
  };

  useEffect(() => {
    if (chapters) {
      if (descending) {
        setChapters(data.slice().reverse());
      } else {
        setChapters(data);
      }
    }
  }, [descending]);
  useEffect(() => {
    setChapters(data);
  }, [data]);
  const {
    data: updateBookmarkData,
    isLoading: updateBookmarkLoading,
    error: updateBookmarkError,
    mutate,
  } = useUpdateBookmark();

  const handleChapterGo = (chapNo) => {
    setGoChapter(chapNo);
  };
  const goToChapter = (e) => {
    e.preventDefault();
    const chapToGo = goChapter;

    if (!chapToGo || chapToGo < 0 || !data?.length) {
      notifications.showNotification({
        title: "Not a valid chapter",
        message: "Please enter a valid chapter number",
      });
    } else if (data?.length < parseInt(chapToGo)) {
      notifications.showNotification({
        title: "Not a valid chapter",
        message: "Sorry, no such chapter",
      });
    } else {
      history.push(`/chapter/${novelParent}-${chapToGo}`);
    }
  };
  const chapterBookmark = (chapSlug) => {
    const notifId = notifications.showNotification({
      title: `Updating Bookmarks `,
      message: `Updating last read chapter, please wait`,
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
    mutate(
      { operation: "add", chapSlug: chapSlug },
      {
        onSuccess: (data) => {
          setLastRead(data?.last_read?.index);
          notifications.updateNotification(notifId, {
            id: notifId,
            loading: false,
            autoClose: 2000,
            title: `Updated`,
            message: `Sucessfully updated last read chapter`,
            icon: <ActionIcon>✓</ActionIcon>,
          });
        },
        onError: () => {
          notifications.updateNotification(notifId, {
            id: notifId,
            loading: false,
            autoClose: 2000,
            title: `Failed`,
            message: `Failed to updated last read chapter due to an error. Please try refreshing`,
            icon: <ActionIcon>X</ActionIcon>,
          });
        },
      }
    );
  };
  return (
    <Container size={desktop ? "lg" : "xs"}>
      <Container size="lg">
        <Group position="center" direction="column">
          <NewCard>
            <Title order={3}>Jump To Chapter</Title>
            <br />
            <Group>
              <form onSubmit={goToChapter}>
                <NumberInput
                  onChange={handleChapterGo}
                  value={goChapter}
                  placeholder="Go To Chapter"
                  hideControls={true}
                  size="xs"
                  disabled={!data?.length}
                />
              </form>
              <Button onClick={goToChapter}>Go</Button>
            </Group>
          </NewCard>
          <br />
        </Group>
      </Container>
      <NewCard>
        <Group position="apart" spacing="lg">
          <Suspense fallback={null}>
            <ChaptersModal
              chapterList={data}
              fetchFunction={refetch}
              loading={isLoading}
              buttonText="≡"
            />
          </Suspense>
          <Button onClick={changeOrdering}>{descending ? "↓" : "↑"}</Button>
        </Group>

        {isLoading &&
          Array.from(new Array(7)).map((element) => {
            return (
              <>
                <Box width={3 / 5}>
                  <Skeleton height={30} />
                </Box>
                <Box width={3 / 7}>
                  <Skeleton height={30} />
                </Box>
              </>
            );
          })}
        {chapters
          ? chapters?.slice((page - 1) * 10, page * 10).map((chapter) => {
              return (
                <div key={chapter.novSlugChapSlug}>
                  <Group
                    position="apart"
                    sx={{
                      div: { paddingBottom: "10px", paddingTop: "10px" },
                      position: "relative",
                    }}
                    spacing="md"
                  >
                    <LinkText
                      to={`${routes.chapter}${chapter.novSlugChapSlug}`}
                    >
                      <Title
                        order={4}
                        sx={{
                          maxWidth: "350px",
                          "@media (min-width: 768px)": {
                            maxWidth: "500px",
                          },
                          "@media (max-width: 500px)": {
                            maxWidth: "180px",
                          },
                          paddingBottom: "10px",
                          paddingTop: "10px",
                        }}
                      >
                        {chapter.title}
                      </Title>
                    </LinkText>
                    {loggedIn && (
                      <Checkbox
                        key={chapter.novSlugChapSlug}
                        checked={lastRead == chapter.index}
                        sx={{
                          position: "absolute",
                          right: 0,
                          paddingLeft: "10px",
                        }}
                        size={phone ? "lg" : "sm"}
                        onClick={() => {
                          if (lastRead == chapter.index) {
                          } else {
                            chapterBookmark(chapter.novSlugChapSlug);
                          }
                        }}
                        readOnly
                      />
                    )}
                  </Group>
                  <LinkText to={`${routes.chapter}${chapter.novSlugChapSlug}`}>
                    <Group
                      position="right"
                      styles={{
                        child: { padding: "10px" },
                      }}
                    >
                      <Text size="sm">{chapter.timeAdded}</Text>
                    </Group>
                  </LinkText>

                  <Divider size="md" />
                </div>
              );
            })
          : !isLoading && (
              <Center>
                <Title order={4}>
                  <Center>No Chapters At The Moment. </Center>
                  <br />
                  Please Comment In Suggestions If You Want This Novel To Be
                  Added
                </Title>
              </Center>
            )}
        <Center>
          <Pagination
            page={page}
            total={
              data?.length == 10 ||
              (data?.length % 10 === 0 && data?.length / 10) ||
              ~~(data?.length / 10) + 1
            }
            onChange={setPage}
          />
        </Center>
      </NewCard>
    </Container>
  );
}

export default React.memo(ChapterBox);

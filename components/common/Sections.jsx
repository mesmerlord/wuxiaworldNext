import { Title, Grid, Col, Card, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import Link from "next/link";
import NewBookCard from "./NewBookCard";
import { routes } from "../utils/Routes";

const Sections = ({ categoryName, categorySlug, novelList, tagSlug }) => {
  const mobile = useMediaQuery("(max-width: 1024px)");

  const novels = novelList?.map((novel) => (
    <Col span={6} xs={4} sm={3} md={3} lg={3} key={novel.slug}>
      <NewBookCard
        bookName={novel.name}
        imageLink={
          !mobile
            ? novel.image
            : novel.imageThumb
            ? novel.imageThumb
            : novel.image
        }
        badgeText={"New"}
        slug={novel.slug}
        rating={novel.rating}
        ranking={novel.ranking}
        views={novel.views}
        chapters={novel.chapters}
      />
    </Col>
  ));

  return (
    <Card
      withBorder
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      })}
    >
      <Title align="center" sx={{ margin: "20px" }}>
        Most Viewed {categoryName} Novels
      </Title>
      <Link
        href={
          tagSlug
            ? `${routes.tag}${tagSlug}`
            : `${routes.category}${categorySlug}`
        }
      >
        <Text
          size="lg"
          transform="uppercase"
          align="right"
          sx={{ margin: "10px" }}
        >
          View More
        </Text>
      </Link>
      <Grid gutter={20}>
        {novelList
          ? novels
          : Array.from(new Array(10)).map((element) => (
              <NewBookCard loading={true} />
            ))}
      </Grid>
    </Card>
  );
};

export default React.memo(Sections);

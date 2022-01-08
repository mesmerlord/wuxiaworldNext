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
import Navbar from "../../components/Navbar/Navbar";
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

  return <Background></Background>;
};

NovelDetail.getLayout = function getLayout(page) {
  return <Navbar>{page}</Navbar>;
};

export default NovelDetail;

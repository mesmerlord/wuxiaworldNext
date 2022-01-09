import { DiscussionEmbed } from "disqus-react";
import { useEffect, useState } from "react";
import { Container } from "@mantine/core";
import React from "react";

const DisqusComments = ({ slug }) => {
  const hostname = () => {
    switch (window.location.hostname) {
      case "www.wuxiaworld.eu":
        return "wuxiaworld-eu";
      case "www.piratenovel.com":
        return "piratenovels";
      case "www.wuxianovels.co":
        return "wuxianovels-co";
      default:
        return "localhost";
    }
  };
  const [shortname, setShortname] = useState(hostname);
  const [url, setUrl] = useState(window.location.href);
  const [title, setTitle] = useState(document.title);

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  return (
    <Container>
      <DiscussionEmbed
        shortname={shortname}
        config={{
          url: url,
          identifier: slug,
          title: title,
        }}
      />
    </Container>
  );
};
export default React.memo(DisqusComments);

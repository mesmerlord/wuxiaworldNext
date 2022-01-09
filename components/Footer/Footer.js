import { Paper, Title, Container } from "@mantine/core";
import { useStore } from "../Store/StoreProvider";

const Footer = () => {
  const siteName = useStore((state) => state.siteName);

  return (
    <Paper radius={0} style={{ paddingTop: "30px" }}>
      <Container>
        <Title order={3} align="center">
          <strong>{siteName}</strong> - cause Novels should be free. Built with{" "}
          <strong>React</strong> and <strong>Django</strong>
        </Title>
      </Container>
      <Container>
        <a href="https://discord.gg/NV4tVGpxPr">
          <Title order={3} align="center">
            <strong>Join Discord</strong>
          </Title>
        </a>
      </Container>
    </Paper>
  );
};
export default Footer;

import { Paper } from "@mantine/core";
import { useStore } from "../Store/StoreProvider";
import {
  MantineProvider,
  NormalizeCSS,
  GlobalStyles,
  ColorSchemeProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

export function getServerSideProps() {
  const zustandStore = initializeStore();

  return {
    props: { initialZustandState: JSON.stringify(zustandStore.getState()) },
  };
}

const Background = (props) => {
  const { darkMode } = useStore();

  return (
    <MantineProvider
      theme={{
        colorScheme: darkMode ? "dark" : "light",
      }}
    >
      <NormalizeCSS />
      <GlobalStyles />
      <NotificationsProvider>
        <Paper
          radius={0}
          style={{ minHeight: "90vh", paddingTop: "15px" }}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme == "light"
                ? theme.colors.gray[1]
                : theme.colors.dark[4],
          })}
        >
          {props.children}
        </Paper>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default Background;

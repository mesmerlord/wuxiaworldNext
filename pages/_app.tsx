import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import { useHydrate } from "../components/Store/Store";
import { StoreProvider } from "../components/Store/StoreProvider";
import React from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import Navbar from "../components/Navbar/Navbar";
import Background from "../components/Background/Background";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const store = useHydrate(pageProps.initialZustandState);
  const [queryClient] = React.useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <MantineProvider withGlobalStyles withNormalizeCSS>
            <Navbar />
            <Background>
              <Component {...pageProps} />
            </Background>
          </MantineProvider>
        </Hydrate>
      </QueryClientProvider>
    </StoreProvider>
  );
};
export default App;

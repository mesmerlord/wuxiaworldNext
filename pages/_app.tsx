import { AppProps } from "next/app";
import { useHydrate } from "../components/Store/Store";
import { StoreProvider } from "../components/Store/StoreProvider";
import React from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import Navbar from "../components/Navbar/Navbar";
import Background from "../components/Background/Background";
import Footer from "../components/Footer/Footer";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const store = useHydrate(pageProps.initialZustandState);
  const [queryClient] = React.useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Background>
            <Navbar />

            <Component {...pageProps} />
            <Footer />
          </Background>
        </Hydrate>
      </QueryClientProvider>
    </StoreProvider>
  );
};
export default App;

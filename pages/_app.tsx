import { AppProps } from "next/app";
import { useHydrate } from "../components/Store/Store";
import { StoreProvider } from "../components/Store/StoreProvider";
import React, { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import Navbar from "../components/Navbar/Navbar";
import Background from "../components/Background/Background";
import Footer from "../components/Footer/Footer";
import { useRouter } from "next/router";
import { NProgress } from "@tanem/react-nprogress";
import { Progress } from "@mantine/core";
import Loading from "../components/common/Loading";

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const store = useHydrate(pageProps.initialZustandState);
  const [queryClient] = React.useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page) => page);
  const router = useRouter();

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [router.events]);
  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Background>
            <Loading
              isRouteChanging={state.isRouteChanging}
              key={state.loadingKey}
            />
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

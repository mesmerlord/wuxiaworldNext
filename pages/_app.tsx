import { AppProps } from 'next/app';
import { useHydrate } from '../components/Store/Store';
import { StoreProvider } from '../components/Store/StoreProvider';
import React from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

const App = (props: AppProps) => {
  const { Component, pageProps } = props;
  const store = useHydrate(pageProps.initialZustandState);
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <StoreProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
        </Hydrate>
      </QueryClientProvider>
    </StoreProvider>
  );
};
export default App;

import { AppProps } from 'next/dist/next-server/lib/router/router';
import React from 'react';
import { Provider } from 'react-redux';
import Layout from '../components/Layout';
import { useStore } from '../redux/store';
import '../styles/global.css';

/**
 * App component
 */
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

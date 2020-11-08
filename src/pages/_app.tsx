import React from 'react';
import { Provider } from 'react-redux';
import Layout from '../components/Layout';
import { useStore } from '../redux/store';
import '../styles/global.css';

/**
 * App component
 */
export default function App({ Component, pageProps }: any) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Layout isAdmin={false}>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

import React from 'react';
import Layout from '../components/Layout';
import '../styles/global.css';

/**
 * App component
 */
export default function App({ Component, pageProps }: any) {
  return (
    <Layout isAdmin={false}>
      <Component {...pageProps} />
    </Layout>
  );
}

import { Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

/**
 * Admin page
 */
export default function Admin(): JSX.Element {
  const router = useRouter();
  React.useEffect(() => {
    router.push('/admin/orders');
  });
  return <Container>Dashboard</Container>;
}

import { Container } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  children: any;
}

/**
 * Admin page
 */
export default function Admin(props: Props) {
  const router = useRouter();
  React.useEffect(() => {
    router.push('/admin/orders');
  });
  return <Container>Dashboard</Container>;
}

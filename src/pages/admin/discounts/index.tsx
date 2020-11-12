import { Container } from '@material-ui/core';
import React from 'react';

interface Props {
  children?: any;
}

/**
 * Discounts page
 */
export default function Component(props: Props) {
  return <Container>Discounts</Container>;
}

/**
 * Ssr
 */
export async function getServerSideProps(context: any) {
  const userData = checkUser(context.req);
  if (
    typeof userData?.user?.id === 'undefined' ||
    !userData?.user?.admin?.isAdmin
  )
    return { props: { error: 'unauth' } };
}

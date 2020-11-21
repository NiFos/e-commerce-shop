import { Container } from '@material-ui/core';
import React from 'react';

interface Props {
  children?: any;
}

/**
 * Category page
 */
export default function Component(props: Props) {
  return <Container>Category</Container>;
}

/**
 * Ssr
 */
export async function getStaticProps(context: any) {
  return { props: {} };
}

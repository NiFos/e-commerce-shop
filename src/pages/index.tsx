import React from 'react';
import Link from 'next/link';
import { Container } from '@material-ui/core';

/**
 * Return Home page
 */
export default function Index(): JSX.Element {
  return (
    <Container>
      <Link href="/admin">
        <a>Admin</a>
      </Link>
    </Container>
  );
}

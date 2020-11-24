import {
  Avatar,
  Container,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';

const name = 'Online shop';
const useStyles = makeStyles({
  header: {
    padding: '5px 0',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  items: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

/**
 * Admin header
 */
export default function Component(): JSX.Element {
  const classes = useStyles();
  return (
    <Container className={classes.header}>
      <div className={classes.content}>
        <div className={classes.items}>
          <Typography variant={'h4'}>{name}</Typography>
          <Divider orientation="vertical" />
          <Link href="/">Main page</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/admins">Admins</Link>
          <Link href="/admin/discounts">Discounts</Link>
        </div>
        <Avatar>NiFos</Avatar>
      </div>
      <Divider />
    </Container>
  );
}

import {
  Avatar,
  Button,
  Container,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

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
  const userState = useSelector((state: RootState) => state.user);

  return (
    <Container className={classes.header}>
      <div className={classes.content}>
        <div className={classes.items}>
          <Typography variant={'h4'}>{name}</Typography>
          <Divider orientation="vertical" />
          <Link href="/">
            <Button>Main page</Button>
          </Link>
          <Link href="/admin/categories">
            <Button>Categories</Button>
          </Link>
          <Link href="/admin/products">
            <Button>Products</Button>
          </Link>
          <Link href="/admin/orders">
            <Button>Orders</Button>
          </Link>
          <Link href="/admin/admins">
            <Button>Admins</Button>
          </Link>
          <Link href="/admin/discounts">
            <Button>Discounts</Button>
          </Link>
        </div>
        <Avatar>{userState.me?.user?.username}</Avatar>
      </div>
      <Divider />
    </Container>
  );
}

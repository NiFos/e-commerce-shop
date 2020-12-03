import {
  Avatar,
  Button,
  Container,
  Divider,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const name = 'Online shop';
const useStyles = makeStyles((theme) => ({
  header: {
    padding: '5px 0',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.3rem',
    },
  },
  items: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
  },
  nav: {
    [theme.breakpoints.down('md')]: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        textAlign: 'center',
      },
      top: '50px',
      left: '0',
      background: '#fff',
      borderRadius: '2px',
      width: '100%',
    },
  },
  burger: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },
}));

/**
 * Admin header
 */
export default function Component(): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const userState = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (theme.breakpoints.down('md')) {
      setIsMobile(true);
    }
  }, [theme.breakpoints]);

  /**
   * Handle navigation click
   */
  function handleNavClick() {
    if (isMobile) {
      setIsNavVisible(!isNavVisible);
    }
  }

  return (
    <Container className={classes.header}>
      <div className={classes.content}>
        <div className={classes.items}>
          <Typography variant={'h4'} className={classes.headerTitle}>
            {name}
          </Typography>
          <Divider orientation="vertical" />
          {isMobile && (
            <Button
              className={classes.burger}
              onClick={() => setIsNavVisible(!isNavVisible)}
            >
              Menu
            </Button>
          )}
          {(isNavVisible || !isMobile) && (
            <nav className={classes.nav} onClick={handleNavClick}>
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
            </nav>
          )}
        </div>
        <Avatar>{userState.me?.user?.username}</Avatar>
      </div>
      <Divider />
    </Container>
  );
}

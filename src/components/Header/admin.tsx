import {
  Avatar,
  Button,
  Container,
  Divider,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import i18n from '../../../i18n';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = i18n.useTranslation('admin');
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const userState = useSelector((state: RootState) => state.user);

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
              {t('header.menu')}
            </Button>
          )}
          {(isNavVisible || !isMobile) && (
            <nav className={classes.nav} onClick={handleNavClick}>
              <Link href="/">
                <Button>{t('header.main-page')}</Button>
              </Link>
              <Link href="/admin/categories">
                <Button>{t('header.categories')}</Button>
              </Link>
              <Link href="/admin/products">
                <Button>{t('header.products')}</Button>
              </Link>
              <Link href="/admin/orders">
                <Button>{t('header.orders')}</Button>
              </Link>
              <Link href="/admin/admins">
                <Button>{t('header.admins')}</Button>
              </Link>
              <Link href="/admin/discounts">
                <Button>{t('header.discounts')}</Button>
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

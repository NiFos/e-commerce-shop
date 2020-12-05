import {
  Avatar,
  Button,
  Container,
  Divider,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useRouter } from 'next/router';
import { logoutUser } from '../../redux/reducers/user';
import { ProfilePopup } from './profilePopup';
import { Categories } from '../Modals/Categories';
import Link from 'next/link';
import { Search } from '../Modals/Search';
import i18n from '../../../i18n';

const name = 'Online shop';
const useStyles = makeStyles((theme) => ({
  header: {
    padding: '5px 0',
    [theme.breakpoints.down('md')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  items: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem',
    },
  },
  cursorPointer: {
    cursor: 'pointer',
  },
  profile: {
    position: 'relative',
  },
}));

/**
 * Frontend header
 */
export default function Component(): JSX.Element {
  const classes = useStyles();
  const { t } = i18n.useTranslation();
  const userState = useSelector((state: RootState) => state.user);
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (JSON.stringify(userState.me) === '{}') {
      router.reload();
    }
  }, [userState]);

  /**
   * Open / Close categories modal on click
   */
  function handleCategoryBtnClick() {
    setCategoriesOpen(!categoriesOpen);
  }

  /**
   * Open / Close search modal on click
   */
  function handleSearchBtnClick() {
    setSearchOpen(!searchOpen);
  }

  /**
   * Open / Close search modal on click
   */
  function handleProfileBtnClick() {
    setProfileOpen(!profileOpen);
  }

  /**
   * Handle pop up clicks
   * @param route - '/profile', '/cart', 'logout'
   */
  function handlePopupClick(route: '/profile' | '/cart' | '/logout') {
    if (route === '/logout') {
      dispatch(logoutUser());
    } else {
      router.push(route);
    }
    handleProfileBtnClick();
  }
  return (
    <Container className={classes.header}>
      <Search open={searchOpen} onClose={handleSearchBtnClick} />
      <Categories open={categoriesOpen} onClose={handleCategoryBtnClick} />
      <div className={classes.content}>
        <div className={classes.items}>
          <Link href="/">
            <Typography variant={'h4'} className={classes.headerTitle}>
              {name}
            </Typography>
          </Link>
          <Divider orientation="vertical" />
          <Button onClick={handleCategoryBtnClick}>{t('categories')}</Button>
          {userState.me?.user?.admin.isAdmin && (
            <Link href="/admin">
              <Button>{t('admin-dashboard')}</Button>
            </Link>
          )}
        </div>
        <div className={classes.items}>
          <IconButton onClick={handleSearchBtnClick}>
            <SearchIcon />
          </IconButton>
          {userState.me?.user?.userid ? (
            <div className={classes.profile}>
              <Avatar
                onClick={handleProfileBtnClick}
                className={classes.cursorPointer}
              >
                {userState?.me?.user.username}
              </Avatar>
              {profileOpen && (
                <ProfilePopup
                  closeHandler={handleProfileBtnClick}
                  handleClick={handlePopupClick}
                  cartItems={userState.me?.cart?.length || 0}
                />
              )}
            </div>
          ) : (
            <Button onClick={() => router.push('/auth')}>{t('auth')}</Button>
          )}
        </div>
      </div>
      <Divider />
    </Container>
  );
}

import {
  Avatar,
  Breadcrumbs,
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
import { Categories } from '../Categories';
import Link from 'next/link';
import { RouteBreadcrums } from './routeBreadcrums';

interface Props {
  children?: any;
}

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
 * Frontend header
 */
export default function Component(props: Props) {
  const classes = useStyles();
  const userState = useSelector((state: RootState) => state.user);
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

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
      <Categories open={categoriesOpen} onClose={handleCategoryBtnClick} />
      <div className={classes.content}>
        <div className={classes.items}>
          <Link href="/">
            <Typography variant={'h4'}>{name}</Typography>
          </Link>
          <Divider orientation="vertical" />
          <Button onClick={handleCategoryBtnClick}>Categories</Button>
        </div>
        <div className={classes.items}>
          <RouteBreadcrums currentRoute={router.asPath} />
        </div>
        <div className={classes.items}>
          <IconButton onClick={handleSearchBtnClick}>
            <SearchIcon />
          </IconButton>
          {userState.me?.user?.userid ? (
            <div>
              <Avatar onClick={handleProfileBtnClick}>NiFos</Avatar>
              {profileOpen && (
                <ProfilePopup
                  closeHandler={handleProfileBtnClick}
                  handleClick={handlePopupClick}
                  cartItems={userState.me?.cart?.length || 0}
                />
              )}
            </div>
          ) : (
            <Button onClick={() => router.push('/auth')}>Auth</Button>
          )}
        </div>
      </div>
      <Divider />
    </Container>
  );
}

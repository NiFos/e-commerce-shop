import React from 'react';
import FrontendHeader from '../Header/frontend';
import AdminHeader from '../Header/admin';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { meUser } from '../../redux/reducers/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import { changeLanguage } from '../../redux/reducers/settings';

interface Props {
  children?: JSX.Element;
}

/**
 * Layout component
 */
export default function Component(props: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (router.query.auth) {
      dispatch(meUser());
    }
  }, [router.pathname]);

  React.useEffect(() => {
    dispatch(meUser());
    const language = localStorage.getItem('language');
    if (typeof language !== 'undefined' && language !== null) {
      dispatch(changeLanguage(language as 'ru' | 'en'));
    }
  }, []);

  return (
    <div>
      {state.meLoadingStatus !== 'loading' ? (
        <div>
          {router.pathname.match(/^\/admin/) ? (
            <AdminHeader />
          ) : (
            <FrontendHeader />
          )}
          {props.children}
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

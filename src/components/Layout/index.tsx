import React from 'react';
import FrontendHeader from '../Header/frontend';
import AdminHeader from '../Header/admin';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { meUser } from '../../redux/reducers/user';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  children: any;
}

/**
 * Layout component
 */
export default function Component(props: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.user);
  React.useEffect(() => {
    dispatch(meUser());
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

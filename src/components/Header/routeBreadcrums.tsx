import { Breadcrumbs, Link } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IBreadcrum } from '../../redux/reducers/settings';
import { RootState } from '../../redux/store';

interface Props {
  currentRoute: string;
}

/**
 * Route breadcrums component
 */
export function RouteBreadcrums(props: Props) {
  const state = useSelector((state: RootState) => state.settings);

  /**
   * Render breadcrums
   */
  function renderBreadcrums() {
    return state.currentRoute.map((item: IBreadcrum) => {
      return (
        <Link href={item.route} key={item.route}>
          {item.title}
        </Link>
      );
    });
  }

  return <Breadcrumbs>{renderBreadcrums()}</Breadcrumbs>;
}

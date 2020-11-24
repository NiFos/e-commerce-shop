import { Breadcrumbs, Link } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { IBreadcrum } from '../../redux/reducers/settings';
import { RootState } from '../../redux/store';

/**
 * Route breadcrums component
 */
export function RouteBreadcrums(): JSX.Element {
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

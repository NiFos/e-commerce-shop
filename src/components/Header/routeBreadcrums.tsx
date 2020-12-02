import { Breadcrumbs, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { IBreadcrum } from '../../redux/reducers/settings';
import { RootState } from '../../redux/store';

const useStyles = makeStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
  },
  breadCrum: {
    color: '000',
  },
  text: {
    color: '#000000',
  },
});

/**
 * Route breadcrums component
 */
export function RouteBreadcrums(): JSX.Element {
  const state = useSelector((state: RootState) => state.settings);
  const classes = useStyles();

  /**
   * Render breadcrums
   */
  function renderBreadcrums() {
    return (state.currentRoute || []).map((item: IBreadcrum) => {
      return (
        <Link href={item.route} key={item.route} className={classes.breadCrum}>
          <span className={classes.text}>{item.title}</span>
        </Link>
      );
    });
  }

  return (
    <Breadcrumbs className={classes.container}>
      {(state?.currentRoute || [])?.length > 1 && renderBreadcrums()}
    </Breadcrumbs>
  );
}

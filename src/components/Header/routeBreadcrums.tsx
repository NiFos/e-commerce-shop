import { Breadcrumbs, Link, makeStyles } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import i18n from '../../../i18n';
import { IBreadcrum } from '../../redux/reducers/settings';
import { RootState } from '../../redux/store';

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  breadCrum: {
    color: '000',
  },
  text: {
    color: '#000000',
  },
}));

/**
 * Route breadcrums component
 */
export function RouteBreadcrums(): JSX.Element {
  const state = useSelector((state: RootState) => state.settings);
  const classes = useStyles();
  const { t } = i18n.useTranslation();

  /**
   * Render breadcrums
   */
  function renderBreadcrums() {
    return (state.currentRoute || []).map((item: IBreadcrum) => {
      return (
        <Link href={item.route} key={item.route} className={classes.breadCrum}>
          <span className={classes.text}>
            {t(`${item.title}`) || item.title}
          </span>
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

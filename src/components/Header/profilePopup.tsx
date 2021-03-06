/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import i18n from '../../../i18n';

const useStyles = makeStyles({
  container: {
    position: 'absolute',
    top: '10px',
    right: '0',
    background: '#ffffff',
    borderRadius: '2px',
  },
});

interface Props {
  handleClick: (route: '/profile' | '/cart' | '/logout') => void;
  closeHandler: () => void;
  cartItems: number;
}

/**
 * Profile popup
 */
export function ProfilePopup(props: Props): JSX.Element {
  const node = React.useRef<HTMLDivElement>(null);
  const { t } = i18n.useTranslation();
  const classes = useStyles();

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  /**
   * Handle click out the component
   */
  function handleClick(e: any) {
    if (node.current !== null && !node.current.contains(e.target)) {
      props.closeHandler();
    }
  }
  return (
    <div ref={node} className={classes.container}>
      <Button onClick={() => props.handleClick('/profile')}>
        {t('profile')}
      </Button>
      <Button onClick={() => props.handleClick('/cart')}>
        {t('cart')}
        {props.cartItems ? `(${props.cartItems})` : ''}
      </Button>
      <Button onClick={() => props.handleClick('/logout')}>
        {t('logout')}
      </Button>
    </div>
  );
}

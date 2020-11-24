import { Button } from '@material-ui/core';
import React from 'react';

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
    <div ref={node}>
      <Button onClick={() => props.handleClick('/profile')}>Profile</Button>
      <Button onClick={() => props.handleClick('/cart')}>
        Cart
        {props.cartItems ? `(${props.cartItems})` : ''}
      </Button>
      <Button onClick={() => props.handleClick('/logout')}>Logout</Button>
    </div>
  );
}

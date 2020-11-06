import React from 'react';
import FrontendHeader from '../Header/frontend';
import AdminHeader from '../Header/admin';

interface Props {
  children: any;
  isAdmin: boolean;
}

/**
 * Layout component
 */
export default function Component(props: Props) {
  return (
    <div>
      {props.isAdmin ? <AdminHeader /> : <FrontendHeader />}
      {props.children}
    </div>
  );
}

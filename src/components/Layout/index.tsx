import React from 'react';
import FrontendHeader from '../Header/frontend';
import AdminHeader from '../Header/admin';
import { useRouter } from 'next/router';

interface Props {
  children: any;
}

/**
 * Layout component
 */
export default function Component(props: Props) {
  const router = useRouter();
  return (
    <div>
      {router.pathname.match(/^\/admin/) ? <AdminHeader /> : <FrontendHeader />}
      {props.children}
    </div>
  );
}

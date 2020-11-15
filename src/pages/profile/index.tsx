import { Container, Divider, Typography } from '@material-ui/core';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { Orders } from '../../components/profile-page/orders';
import { Settings } from '../../components/profile-page/settings';
import { checkUser } from '../../libs/withUser';
import { orderModel } from '../../models/order';
import { userModel } from '../../models/user';
import { getProfileInfo } from '../../redux/reducers/user';
import { initializeStore, RootState } from '../../redux/store';

interface Props {
  children?: any;
  userInfo: {
    username: string;
    phone: string;
    deliveryAddress: string;
    orders: any[];
    createdOn: string;
  };
}

/**
 * Profile page
 */
export default function Component(props: Props) {
  const userState = useSelector((state: RootState) => state.user);
  const router = useRouter();

  React.useEffect(() => {
    if (userState.editLoadingStatus === 'loaded') {
      router.reload();
    }
  }, [userState]);

  return (
    <Container>
      <div>
        <div>
          <div>
            <Typography variant={'h6'}>
              Hello, {userState.me?.user?.username}
            </Typography>
            <Typography variant={'subtitle1'}>
              You have been registered:{' '}
              {moment(props.userInfo.createdOn).format('lll')}
            </Typography>
          </div>
          <Divider orientation={'vertical'} />
          <div>
            <Typography variant={'h6'}>Need help?</Typography>
            <Typography variant={'subtitle1'}>
              Contact us in <a href={'https://t.me'}>Telegram</a>
            </Typography>
          </div>
        </div>
        <div>
          <Orders orders={props.userInfo.orders} />
          <Settings
            phone={props.userInfo.phone || ''}
            deliveryAddress={props.userInfo.deliveryAddress || ''}
          />
        </div>
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export async function getServerSideProps(context: any) {
  const userData = checkUser(context.req);
  if (typeof userData?.user?.id === 'undefined')
    return { props: { error: 'unauth' } };

  const reduxStore = initializeStore({});
  const orders = await orderModel.getUserOrders(userData.user.id);
  const ordersData = orders.map((item: any) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));
  const userInformation = await userModel.findUserById(userData.user.id);

  await reduxStore.dispatch(
    getProfileInfo(
      userInformation[0].username,
      userInformation[0].phone,
      userInformation[0].delivery_address,
      ordersData
    )
  );
  return {
    props: {
      userInfo: {
        username: userInformation[0].username,
        phone: userInformation[0].phone,
        deliveryAddress: userInformation[0].delivery_address,
        orders: ordersData,
        createdOn: new Date(userInformation[0].created_on).toString(),
      },
    },
  };
}

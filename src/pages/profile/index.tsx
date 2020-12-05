import {
  Card,
  CardContent,
  Container,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import i18n from '../../../i18n';
import { Orders } from '../../components/profile-page/orders';
import { Settings } from '../../components/profile-page/settings';
import { checkUser } from '../../libs/withUser';
import { IUserOrderModel, orderModel } from '../../models/order';
import { userModel } from '../../models/user';
import { getProfileInfo } from '../../redux/reducers/user';
import { initializeStore, RootState } from '../../redux/store';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerContent: {
    width: '45%',
    padding: '30px',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  orders: {
    width: '71%',
  },
  settings: {
    width: '27%',
  },
});

interface Props {
  children?: JSX.Element[];
  userInfo: {
    username: string;
    phone: string;
    deliveryAddress: string;
    orders: IUserOrderModel[];
    createdOn: string;
  };
}

/**
 * Profile page
 */
export default function Component(props: Props): JSX.Element {
  const userState = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { t } = i18n.useTranslation();
  const classes = useStyles();

  React.useEffect(() => {
    if (userState.editLoadingStatus === 'loaded') {
      router.reload();
    }
  }, [userState]);

  return (
    <Container>
      <div>
        <Card>
          <CardContent className={classes.header}>
            <div className={classes.headerContent}>
              <Typography variant={'h6'}>
                {t('profile-page.hello', {
                  username: userState.me?.user?.username,
                })}
              </Typography>
              <Typography variant={'subtitle1'}>
                {t('profile-page.registered', {
                  date: moment(props.userInfo.createdOn).format('lll'),
                })}
              </Typography>
            </div>
            <div>
              <Divider orientation={'vertical'} />
            </div>
            <div className={classes.headerContent}>
              <Typography variant={'h6'}>{t('profile-page.help')}</Typography>
              <Typography variant={'subtitle1'}>
                {t('profile-page.contact-us')}{' '}
                <a href={'https://t.me'}>Telegram</a>
              </Typography>
            </div>
          </CardContent>
        </Card>
        <div className={classes.content}>
          <div className={classes.orders}>
            <Orders orders={props.userInfo.orders} />
          </div>
          <div className={classes.settings}>
            <Settings
              phone={props.userInfo.phone || ''}
              deliveryAddress={props.userInfo.deliveryAddress || ''}
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = checkUser(context.req);
  if (typeof userData?.user?.id === 'undefined')
    return { props: { error: 'unauth' } };

  const reduxStore = initializeStore();
  const orders = await orderModel.getUserOrders(userData.user.id);
  const ordersData = orders.map((item) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));
  const userInformation = await userModel.findUserById(userData.user.id);

  await reduxStore.dispatch(
    getProfileInfo(
      userInformation[0].username,
      userInformation[0].phone || '',
      userInformation[0].delivery_address || '',
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
};

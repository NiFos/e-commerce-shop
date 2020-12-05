import {
  Button,
  Card,
  CardContent,
  Container,
  Input,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from '../../libs/withUser';
import { cartModel, IUserCart } from '../../models/cart';
import { userModel } from '../../models/user';
import { changeRoute } from '../../redux/reducers/settings';
import {
  checkoutUser,
  getCart,
  getProfileInfo,
  getPromocode,
  removeFromCart,
} from '../../redux/reducers/user';
import { initializeStore, RootState } from '../../redux/store';
import { loadStripe } from '@stripe/stripe-js';
import { GetServerSideProps } from 'next';
import { getPhotoUrl } from '../../libs/storage';
import i18n from '../../../i18n';

const useStyles = makeStyles({
  cart: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  product: {},
  productContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  productText: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  productInfo: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cartList: {
    width: '60%',
  },
  checkout: {},
  img: {
    '& > *': {
      height: 'auto',
      width: '100%',
      maxWidth: '300px',
      objectFit: 'cover',
    },
  },
});

interface Props {
  children?: JSX.Element[];
  cart: IUserCart[];
  stripeKey: string;
}

/**
 * Cart page
 */
export default function Component(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const classes = useStyles();
  const { t } = i18n.useTranslation(['common', 'orders']);
  const userState = useSelector((state: RootState) => state.user);
  const [promoValue, setPromoValue] = React.useState('');
  const [totalPrice, setTotalPrice] = React.useState(0);

  React.useEffect(() => {
    dispatch(changeRoute('cart', {}));
  }, []);

  React.useEffect(() => {
    if (userState.removeFromCartLoadingStatus === 'loaded') {
      router.reload();
    }
    if (userState.checkoutLoadingStatus === 'loaded') {
      stripeCheckout();
    }
    calcTotalPrice();
  }, [userState]);

  /**
   * Redirect to stripe checkout
   */
  async function stripeCheckout() {
    if (typeof userState.checkoutId !== 'undefined') {
      const stripePromise = loadStripe(props.stripeKey);
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId: userState.checkoutId });
    }
  }

  /**
   * Remove product from cart
   */
  function removeHandler(productId: number) {
    dispatch(removeFromCart(productId));
  }

  /**
   * Checkout
   */
  function checkoutHandler() {
    dispatch(checkoutUser(promoValue));
  }

  /**
   * Apply promocode handler
   */
  function applyPromoHandler() {
    dispatch(getPromocode(promoValue));
  }

  /**
   * Calc total price
   */
  function calcTotalPrice() {
    let total = (props?.cart || []).reduce(
      (sum, current) => sum + current.price * current.quantity,
      0
    );
    if (typeof userState?.promocode?.discount !== 'undefined') {
      total = total * ((100 - userState?.promocode?.discount.percentage) / 100);
    }
    setTotalPrice(total);
  }

  /**
   * Render products
   */
  function renderProducts() {
    return props.cart.map((item) => {
      return (
        <Card key={item.product_id} className={classes.product}>
          <CardContent className={classes.productContent}>
            <div className={classes.img}>
              <img src={item.photo || ''} alt="" />
            </div>
            <div className={classes.productInfo}>
              <div className={classes.productText}>
                <div>{item.title}</div>
                <div>
                  {t('orders:quantity')}: {item.quantity}
                </div>
              </div>
              <div className={classes.productText}>
                <div>
                  {t('orders:total-price')}: {item.quantity * item.price}
                </div>
                <Button onClick={() => removeHandler(item.product_id)}>
                  {t('common:remove')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    });
  }
  return (
    <Container>
      <Typography variant="h5">{t('common:cart')}</Typography>
      {(props?.cart?.length || []) > 0 ? (
        <div className={classes.cart}>
          <div className={classes.cartList}>{renderProducts()}</div>
          <Card>
            <CardContent className={classes.checkout}>
              <div>
                {t('orders:total-price')}: {totalPrice}{' '}
                {typeof userState?.promocode?.discount?.promocode !==
                'undefined'
                  ? `(${t(
                      'common:applied-promocode'
                    )}: ${userState?.promocode?.discount?.promocode.toUpperCase()} - ${
                      userState?.promocode?.discount?.percentage
                    }% )`
                  : ''}
              </div>
              <div>
                {t('orders:delivery-address')}:{' '}
                {userState.me?.profileInfo?.deliveryAddress}
              </div>
              <div>
                <span>{t('common:promocode')}: </span>
                <Input
                  value={promoValue}
                  onChange={(e) => setPromoValue(e.target.value)}
                />
                <Button onClick={applyPromoHandler}>{t('common:apply')}</Button>
              </div>
              <Button onClick={checkoutHandler}>{t('common:checkout')}</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>{t('common.nothing-yet')}</div>
      )}
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

  const cart = await cartModel.getUserCart(userData.user.id);
  const userInformation = await userModel.findUserById(userData.user.id);

  await reduxStore.dispatch(
    getProfileInfo(
      userInformation[0].username,
      userInformation[0].phone || '',
      userInformation[0].delivery_address || ''
    )
  );
  await reduxStore.dispatch(getCart(cart));
  const cartData = cart.map((item) => ({
    ...item,
    photo: getPhotoUrl('products', '' + item.product_id),
  }));
  return {
    props: {
      cart: cartData,
      stripeKey: process.env.STRIPE_PUBLIC_KEY || '',
    },
  };
};

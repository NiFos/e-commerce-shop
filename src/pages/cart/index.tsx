import { Button, Container, Input, Typography } from '@material-ui/core';
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
        <div key={item.product_id}>
          <img src={item.photo || ''} alt="" />
          <div>
            <div>{item.title}</div>
            <div>{item.quantity}</div>
          </div>
          <div>
            <div>Total price: {item.quantity * item.price}</div>
            <Button onClick={() => removeHandler(item.product_id)}>
              Remove
            </Button>
          </div>
        </div>
      );
    });
  }
  return (
    <Container>
      <Typography variant="h5">Cart</Typography>
      {(props?.cart?.length || []) > 0 ? (
        <div>
          <div>{renderProducts()}</div>
          <div>
            <div>
              Total price: {totalPrice}{' '}
              {typeof userState?.promocode?.discount?.promocode !== 'undefined'
                ? `(Applied promocode: ${userState?.promocode?.discount?.promocode.toUpperCase()} - ${
                    userState?.promocode?.discount?.percentage
                  }% )`
                : ''}
            </div>
            <div>
              Delivery address: {userState.me?.profileInfo?.deliveryAddress}
            </div>
            <div>
              <span>Promocode: </span>
              <Input
                value={promoValue}
                onChange={(e) => setPromoValue(e.target.value)}
              />
              <Button onClick={applyPromoHandler}>Apply</Button>
            </div>
            <Button onClick={checkoutHandler}>Checkout</Button>
          </div>
        </div>
      ) : (
        <div>There is nothing yet.</div>
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
  return {
    props: {
      cart: cart,
      stripeKey: process.env.STRIPE_PUBLIC_KEY || '',
    },
  };
};

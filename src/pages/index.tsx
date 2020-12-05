import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { productModel } from '../models/product';
import { discountModel } from '../models/discount';
import { getPhotoUrl } from '../libs/storage';
import { GetStaticProps } from 'next';
import moment from 'moment';
import { ProductLink } from '../components/ProductLink';
import i18n from '../../i18n';

const useStyles = makeStyles((theme) => ({
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  block: {
    marginBottom: '20px',
    marginTop: '20px',
  },
  mainDiscount: {
    width: '73%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  lastProduct: {
    width: '25%',
    [theme.breakpoints.down('md')]: {
      marginTop: '20px',
      width: '100%',
    },
    cursor: 'pointer',
  },
  discount: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  discountInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productList: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  title: {
    marginBottom: '10px',
  },
  img: {
    '& > *': {
      height: 'auto',
      width: '100%',
      maxWidth: '400px',
      objectFit: 'cover',
    },
  },
}));

interface Product {
  productId: number;
  title: string;
  price: number;
  photo: string;
  rating?: number;
}

interface Props {
  mainDiscount: {
    discountId: number;
    title: string;
    description: string;
    percentDiscount: number;
    to: Date;
    photo: string;
    promocode: string;
  };
  lastNewProduct: Product;
  popular: Product[];
  topRated: Product[];
}

/**
 * Home page
 */
export default function Component(props: Props): JSX.Element {
  const classes = useStyles();
  const { t } = i18n.useTranslation();

  /**
   * Render popular section
   */
  function renderPopular() {
    return props.popular.map((item) => {
      return (
        <ProductLink
          key={item.productId}
          photo={item.photo}
          productId={item.productId}
          title={item.title}
          price={item.price}
        />
      );
    });
  }

  /**
   * Render top rated section
   */
  function renderTopRated() {
    return props.topRated.map((item) => {
      return (
        <ProductLink
          key={item.productId}
          photo={item.photo}
          productId={item.productId}
          title={item.title}
          price={item.price}
        />
      );
    });
  }

  return (
    <Container>
      <div className={[classes.top, classes.block].join(' ')}>
        <Card className={classes.mainDiscount}>
          <CardContent className={classes.discount}>
            <div className={classes.discountInfo}>
              <div>
                <Typography variant={'h5'}>
                  {props.mainDiscount.title}
                </Typography>
                <Typography variant={'subtitle1'}>
                  {props.mainDiscount.description}
                </Typography>
              </div>
              <div>
                <Typography variant={'subtitle2'}>
                  {t('promocode')} - {props.mainDiscount.promocode}
                </Typography>
                <Typography variant={'subtitle2'}>
                  {t('due-date')}
                  {moment(props.mainDiscount.to).format('lll')}
                </Typography>
              </div>
            </div>
            <div className={classes.img}>
              <img src={props.mainDiscount.photo} alt="discount" />
            </div>
          </CardContent>
        </Card>
        <Card className={classes.lastProduct}>
          <CardContent>
            <Link href={`/product/${props.lastNewProduct.productId}`}>
              <div>
                <div className={classes.img}>
                  <img src={props.lastNewProduct.photo} alt="" />
                </div>
                <Typography variant={'subtitle1'}>
                  {props.lastNewProduct.title}
                </Typography>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Card className={classes.block}>
        <CardContent>
          <Typography variant={'h5'} className={classes.title}>
            {t('main.popular')}
          </Typography>
          <div className={classes.productList}>
            {props?.popular && renderPopular()}
          </div>
        </CardContent>
      </Card>
      <Card className={classes.block}>
        <CardContent>
          <Typography variant={'h5'} className={classes.title}>
            {t('main.top-5-rated')}
          </Typography>
          <div>{props?.topRated && renderTopRated()}</div>
        </CardContent>
      </Card>
    </Container>
  );
}

/**
 * Ssr
 */
export const getStaticProps: GetStaticProps = async () => {
  const mainDiscount = await discountModel.getRandomDiscount();
  const lastNewProduct = await productModel.getLastNewProduct();
  const popular = await productModel.getPopularProducts();
  const topRated = await productModel.getTopRated();
  return {
    props: {
      mainDiscount: {
        discountId: mainDiscount[0]?.discount_id,
        title: mainDiscount[0]?.title,
        description: mainDiscount[0]?.description,
        percentDiscount: mainDiscount[0]?.percent_discount,
        promocode: mainDiscount[0]?.promocode,
        to: new Date(mainDiscount[0]?.date_to).toString(),
        photo: getPhotoUrl('discounts', '' + mainDiscount[0].discount_id),
      },
      lastNewProduct: {
        productId: lastNewProduct[0]?.product_id,
        title: lastNewProduct[0]?.title,
        price: lastNewProduct[0]?.price,
        photo: getPhotoUrl('products', '' + lastNewProduct[0]?.product_id),
      },
      popular: popular.map((item) => ({
        productId: item?.product_id,
        title: item?.title,
        price: item?.price,
        photo: getPhotoUrl('products', '' + item?.product_id),
      })),
      topRated: topRated.map((item) => ({
        productId: item?.product_id,
        title: item?.title,
        price: item?.price,
        rating: item?.rating,
        photo: getPhotoUrl('products', '' + item?.product_id),
      })),
    },
  };
};

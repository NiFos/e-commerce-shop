import React from 'react';
import Link from 'next/link';
import { Container } from '@material-ui/core';
import { productModel } from '../models/product';
import { discountModel } from '../models/discount';
import { getPhotoUrl } from '../libs/storage';

interface Props {
  mainDiscount: any;
  lastNewProduct: any;
  popular: any[];
  topRated: any[];
}

/**
 * Home page
 */
export default function Component(props: Props): JSX.Element {
  /**
   * Render popular section
   */
  function renderPopular() {
    return props.popular.map((item: any) => {
      return (
        <Link href={`/product/${item.product_id}`} key={item.product_id}>
          <div>
            <img width={300} height={300} src={item.photo} alt="" />
            <span>{item.title}</span>
            <span>{item.price}</span>
          </div>
        </Link>
      );
    });
  }

  /**
   * Render top rated section
   */
  function renderTopRated() {
    return props.topRated.map((item: any) => {
      return (
        <Link href={`/product/${item.product_id}`} key={item.product_id}>
          <div>
            <img width={300} height={300} src={item.photo} alt="" />
            <span>{item.title}</span>
            <span>{item.price}</span>
          </div>
        </Link>
      );
    });
  }

  return (
    <Container>
      <div>
        <div>Discount</div>
        <div>Last new product</div>
      </div>
      <div>
        <div>Popular</div>
        <div>{props?.popular && renderPopular()}</div>
      </div>
      <div>
        <div>Top 5 rated</div>
        <div>{props?.topRated && renderTopRated()}</div>
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export async function getStaticProps(context: any) {
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
        to: new Date(mainDiscount[0]?.date_to).toString(),
        photo: getPhotoUrl('discounts', mainDiscount[0].discount_id),
      },
      lastNewProduct: {
        productId: lastNewProduct[0]?.product_id,
        title: lastNewProduct[0]?.title,
        price: lastNewProduct[0]?.price,
        photo: getPhotoUrl('products', lastNewProduct[0]?.product_id),
      },
      popular: popular.map((item: any) => ({
        productId: item?.product_id,
        title: item?.title,
        price: item?.price,
        photo: getPhotoUrl('products', item?.product_id),
      })),
      topRated: topRated.map((item: any) => ({
        productId: item?.product_id,
        title: item?.title,
        price: item?.price,
        rating: item?.rating,
        photo: getPhotoUrl('products', item?.product_id),
      })),
    },
  };
}

import React from 'react';
import { Card, CardContent, Link, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  product: {
    width: '25%',
    display: 'block',
    marginRight: '20px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: '20px',
    },
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

interface Props {
  productId: number;
  photo: string;
  title: string;
  price: number;
  description?: string;
}

/**
 * ProductLink component
 */
export function ProductLink(props: Props): JSX.Element {
  const classes = useStyles();
  return (
    <Link href={`/product/${props.productId}`} className={classes.product}>
      <Card>
        <CardContent>
          <div className={classes.img}>
            <img width={300} height={300} src={props.photo} alt="" />
          </div>
          <div>
            <div>{props.title}</div>
            <div>{props.description}</div>
            <div>{props.price} USD</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

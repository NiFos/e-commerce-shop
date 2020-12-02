import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPhotoUrl } from '../../libs/storage';
import { IProductModel, productModel } from '../../models/product';
import { IReviewModel, reviewModel } from '../../models/review';
import { sendReview } from '../../redux/reducers/products';
import { changeRoute } from '../../redux/reducers/settings';
import { addProductToCart } from '../../redux/reducers/user';
import { RootState } from '../../redux/store';

const useStyles = makeStyles({
  product: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    marginBottom: '10px',
  },
  photo: {},
  info: { width: '71%' },
  header: { display: 'flex', justifyContent: 'space-between' },
  review: { marginTop: '10px' },
  reviewsList: {},
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%',
      marginBottom: '10px',
    },
  },
});

interface Props {
  children?: JSX.Element[];
  product: IProductModel;
  reviews: IReviewModel[];
}

/**
 * Product page
 */
export default function Component(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [quantity, setQuantity] = React.useState<number>(1);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [reviewText, setReviewText] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openReviewSnackbar, setOpenReviewSnackbar] = React.useState(false);
  const [reviewRating, setReviewRating] = React.useState(1);
  const userState = useSelector((state: RootState) => state.user);
  const state = useSelector((state: RootState) => state.products);
  React.useEffect(() => {
    if (userState.addToCartLoadingStatus === 'loaded') {
      setOpenSnackbar(true);
    }
    if (state.addReviewLoadingStatus === 'loaded') {
      setOpenReviewSnackbar(true);
    }
  }, [userState, state]);

  React.useEffect(() => {
    dispatch(
      changeRoute('product', {
        productId: props.product.product_id,
        categoryId: props.product.subcategory_id,
        productTitle: props.product.title,
        categoryTitle: props.product.subcategory_title,
      })
    );
  }, []);

  /**
   * Add this product to cart
   */
  function addToCart() {
    dispatch(addProductToCart(props.product.product_id, quantity));
  }

  /**
   * Open send review modal
   */
  function reviewHandler() {
    setReviewOpen(!reviewOpen);
  }

  /**
   * Submit review
   */
  function submitReview() {
    dispatch(sendReview(reviewRating, reviewText, props.product.product_id));
  }

  /**
   * Render reviews
   */
  function renderReviews() {
    return props.reviews.map((item) => {
      return (
        <Card key={item.review_id} className={classes.review}>
          <CardContent>
            <div className={classes.header}>
              <div>{item.username}</div>
              <div>{moment(item.created_on).fromNow()}</div>
              <div>Rating: {item.rating}</div>
            </div>
            <Divider />
            <div>{item.text}</div>
          </CardContent>
        </Card>
      );
    });
  }
  return (
    <Container>
      {/* New review modal */}
      <Dialog open={reviewOpen} onClose={reviewHandler}>
        <DialogTitle>Send review</DialogTitle>
        <DialogContent className={classes.modalContent}>
          <div>
            <div>Review: </div>
            <Input
              multiline
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Please type the text"
            />
          </div>
          <div>
            <span>Rating: </span>
            <Select
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value as number)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={reviewHandler}>Cancel</Button>
          <Button onClick={submitReview}>Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Added to cart snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        message={'Product added to cart!'}
      />
      {/* Review sent snackbar */}
      <Snackbar
        open={openReviewSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenReviewSnackbar(false)}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        message={'Review sent to cart!'}
      />
      <Typography variant={'h5'}>{props.product.title}</Typography>

      {/* Product */}
      <div className={classes.product}>
        {/* Product photo */}
        <Card>
          <CardContent className={classes.photo}>
            <img
              width={300}
              height={300}
              src={props.product.photo}
              alt="product photo"
            />
          </CardContent>
        </Card>

        {/* Product info */}
        <Card className={classes.info}>
          <CardContent>
            <CardContent className={classes.header}>
              <div>{props.product.price} RUB</div>
              <div>
                Quantity:
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                  placeholder="Enter quantity"
                />
                <Button onClick={addToCart}>Add to cart</Button>
              </div>
            </CardContent>
            <div>{props.product.rating}</div>
            <div>{props.product.techspecs}</div>
            <div>{props.product.description}</div>
          </CardContent>
        </Card>
      </div>
      {/* Reviews */}
      <Card>
        <CardContent className={classes.header}>
          <div>Count reviews: {props.reviews.length}</div>
          <Button onClick={reviewHandler}>Send review</Button>
        </CardContent>
      </Card>
      {/* Reviews list */}
      <div className={classes.reviewsList}>
        {props.reviews ? renderReviews() : <div>There are no reviews yet</div>}
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const id = +(context?.params?.id || 0);
  const product = await productModel.getProduct(id);
  const productData = {
    ...product[0],
    created_on: new Date(product[0].created_on).toString(),
    photo: getPhotoUrl('products', '' + product[0].product_id),
  };

  const reviews = await reviewModel.getProductReviews(id);
  const reviewsData = reviews.map((item) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));

  return { props: { product: productData, reviews: reviewsData } };
};

/**
 * Static paths
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const products = await productModel.getIds();
  const paths = products.map((item) => ({
    params: { id: item.product_id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

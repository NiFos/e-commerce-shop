import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPhotoUrl } from '../../libs/storage';
import { productModel } from '../../models/product';
import { reviewModel } from '../../models/review';
import { sendReview } from '../../redux/reducers/products';
import { changeRoute } from '../../redux/reducers/settings';
import { addProductToCart } from '../../redux/reducers/user';
import { RootState } from '../../redux/store';

interface Props {
  children?: any;
  product: any;
  reviews: any[];
}

/**
 * Product page
 */
export default function Component(props: Props) {
  const dispatch = useDispatch();
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
    console.log(props.product);

    return props.reviews.map((item: any) => {
      return (
        <div key={item.review_id}>
          <div>
            <div>{item.username}</div>
            <div>{moment(item.created_on).fromNow()}</div>
            <div>{item.rating}</div>
          </div>
          <Divider />
          <div>{item.text}</div>
        </div>
      );
    });
  }
  return (
    <Container>
      <Dialog open={reviewOpen} onClose={reviewHandler}>
        <DialogTitle>Send review</DialogTitle>
        <DialogContent>
          <Input
            multiline
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Your review text"
          />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={reviewHandler}>Cancel</Button>
          <Button onClick={submitReview}>Submit</Button>
        </DialogActions>
      </Dialog>
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
      <div>
        <div>
          <img
            width={300}
            height={300}
            src={props.product.photo}
            alt="product photo"
          />
        </div>
        <div>
          <div>
            <div>{props.product.price} RUB</div>
            <div>
              Quantity:
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
                placeholder="Enter quantity"
              />
            </div>
            <Button onClick={addToCart}>Add to cart</Button>
          </div>
          <div>{props.product.rating}</div>
          <div>{props.product.techspecs}</div>
          <div>{props.product.description}</div>
        </div>
      </div>
      <div>
        <div>Count reviews</div>
        <Button onClick={reviewHandler}>Send review</Button>
      </div>
      <div>
        {props.reviews ? renderReviews() : <div>There are no reviews yet</div>}
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export async function getStaticProps(context: any) {
  const product = await productModel.getProduct(+context.params.id);
  const productData = {
    ...product[0],
    created_on: new Date(product[0].created_on).toString(),
    photo: getPhotoUrl('products', product[0].product_id),
  };

  const reviews = await reviewModel.getProductReviews(+context.params.id);
  const reviewsData = reviews.map((item: any) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));

  return { props: { product: productData, reviews: reviewsData } };
}

/**
 * Static paths
 */
export async function getStaticPaths() {
  const products = await productModel.getIds();
  const paths = products.map((item: any) => ({
    params: { id: item.product_id.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
}

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
import i18n from '../../../i18n';
import { getPhotoUrl } from '../../libs/storage';
import { IProductModel, productModel } from '../../models/product';
import { IReviewModel, reviewModel } from '../../models/review';
import { sendReview } from '../../redux/reducers/products';
import { changeRoute } from '../../redux/reducers/settings';
import { addProductToCart } from '../../redux/reducers/user';
import { RootState } from '../../redux/store';

const useStyles = makeStyles((theme) => ({
  product: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      justifyContent: 'start',
    },
    marginTop: '10px',
    marginBottom: '10px',
  },
  photo: {},
  info: {
    width: '71%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: '20px',
    },
  },
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
}));

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
  const { t } = i18n.useTranslation();
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
              <div>
                <div>{moment(item.created_on).format('l')}</div>
              </div>
              <div>
                {t('product.review.rating')}: {item.rating}
              </div>
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
        <DialogTitle>{t('product.review.send-review')}</DialogTitle>
        <DialogContent className={classes.modalContent}>
          <div>
            <div>{t('product.review.review')}: </div>
            <Input
              multiline
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t('product.review.send-review-placeholder')}
            />
          </div>
          <div>
            <span>{t('product.review.rating')}: </span>
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
          <Button onClick={reviewHandler}>{t('cancel')}</Button>
          <Button onClick={submitReview}>{t('submit')}</Button>
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
        message={t('product.review.review-sent')}
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
              <div>{props.product.price} USD</div>
              <div>
                {t('product.quantity')}:
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(+e.target.value)}
                  placeholder={t('product.enter-quantity')}
                />
                <Button onClick={addToCart}>{t('product.add-to-cart')}</Button>
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
          <div>
            {t('product.review.count-reviews')}: {props.reviews.length}
          </div>
          <Button onClick={reviewHandler}>
            {t('product.review.send-review')}
          </Button>
        </CardContent>
      </Card>
      {/* Reviews list */}
      <div className={classes.reviewsList}>
        {props.reviews ? renderReviews() : <div>{t('nothing-yet')}</div>}
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

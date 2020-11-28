import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPhotoUrl } from '../../../libs/storage';
import { checkUser } from '../../../libs/withUser';
import { IProductModel, productModel } from '../../../models/product';
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProducts,
  uploadProductPhoto,
} from '../../../redux/reducers/products';
import { initializeStore, RootState } from '../../../redux/store';
import { UploadPhotoModal } from '../../../components/Modals/uploadPhoto';
import moment from 'moment';
import { Pagination } from '../../../components/Pagination';
import { GetServerSideProps } from 'next';
import { Tags } from './tags';

interface Props {
  children?: JSX.Element[];
  products: IProductModel[];
  hasMore: boolean;
  page: number;
}

interface IProductData {
  title?: string;
  description?: string;
  techspecs?: string;
  price?: number;
  quantity?: number;
  subcategory_id?: number;
  tags?: number[];
}

/**
 * Products page
 */
export default function Component(props: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [currentProductId, setCurrentProductId] = React.useState(-1);
  const [currentProductIndex, setCurrentProductIndex] = React.useState(-1);
  const [openUploadPhoto, setOpenUploadPhoto] = React.useState(false);
  const [productModalOpen, setProductModalOpen] = React.useState(false);
  const [productData, setProductData] = React.useState<IProductData>({});
  const router = useRouter();
  const state = useSelector((state: RootState) => state.products);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (
      state.deleteLoadingStatus === 'loaded' ||
      state.uploadPhotoLoadingStatus === 'loaded' ||
      state.editLoadingStatus === 'loaded'
    ) {
      router.reload();
    }
    if (state.createLoadingStatus === 'loaded') {
      cleanProduct();
      setCurrentProductId(state.newProduct?.id || -1);
      setOpenUploadPhoto(true);
    }
  }, [state]);

  React.useEffect(() => {
    router.events.on('routeChangeStart', () => setLoading(true));
    router.events.on('routeChangeComplete', () => setLoading(false));

    return () => {
      router.events.off('routeChangeStart', () => setLoading(true));
      router.events.off('routeChangeComplete', () => setLoading(false));
    };
  }, []);

  /**
   *
   * @param next If true current page +1
   */
  function pagination(next: boolean) {
    const currentPage = router.query.page || 1;
    router.push({
      pathname: router.pathname,
      query: `page=${next ? '' + (+currentPage + 1) : '' + (+currentPage - 1)}`,
    });
  }

  /**
   * Change product data values
   * @param name - Name of property
   * @param value - Value
   */
  function productDataHandler(name: string, value: string | number) {
    if (name !== 'tags') {
      const data = {
        ...productData,
        [name]: value,
      };
      setProductData(data);
    } else {
      const tags = productData.tags || [];
      let newSelected;
      if (tags?.includes(+value)) {
        newSelected = tags.filter((item) => item !== +value);
      } else {
        newSelected = [...(tags as number[])];
        newSelected.push(+value);
      }
      const data = {
        ...productData,
        tags: newSelected,
      };
      setProductData(data);
    }
  }

  /**
   * New product handler (open modal)
   */
  function productHandler(isNew: boolean, id?: number) {
    setProductModalOpen(true);
    if (!isNew) {
      setCurrentProductId(id || -1);
      const index = props.products.findIndex((item) => item.product_id === id);
      setCurrentProductIndex(index);
      setProductData(props.products[index]);
    }
  }

  /**
   * Clean product data & close modal
   */
  function cleanProduct() {
    setProductModalOpen(false);
    setCurrentProductIndex(-1);
    setCurrentProductId(-1);
    setProductData({});
  }

  /**
   * Submit new product
   */
  function submitNew() {
    if (
      typeof productData.title !== 'undefined' &&
      typeof productData.description !== 'undefined' &&
      typeof productData.techspecs !== 'undefined' &&
      typeof productData.price !== 'undefined' &&
      typeof productData.quantity !== 'undefined' &&
      typeof productData.subcategory_id !== 'undefined'
    )
      dispatch(
        createProduct(
          productData.title,
          productData.description,
          productData.techspecs,
          productData.price,
          productData.quantity,
          productData.subcategory_id,
          productData.tags || []
        )
      );
  }

  /**
   * Submit edit product
   */
  function submitEdit() {
    dispatch(
      editProduct({
        productId: currentProductId,
        title:
          productData.title !== props.products[currentProductIndex].title
            ? productData.title
            : 'undefined',
        description:
          productData.description !==
          props.products[currentProductIndex].description
            ? productData.description
            : undefined,
        techspecs:
          productData.techspecs !==
          props.products[currentProductIndex].techspecs
            ? productData.techspecs
            : undefined,
        price:
          productData.price !== props.products[currentProductIndex].price
            ? productData.price
            : undefined,
        quantity:
          productData.quantity !== props.products[currentProductIndex].quantity
            ? productData.quantity
            : undefined,
        subcategoryId:
          productData.subcategory_id !==
          props.products[currentProductIndex].subcategory_id
            ? productData.subcategory_id
            : undefined,
      })
    );
  }

  /**
   * Submit delete product
   */
  function submitDelete() {
    dispatch(deleteProduct(currentProductId));
  }

  /**
   * Clean upload photo data and close modal
   */
  function cleanUploadPhoto() {
    setProductModalOpen(false);
    setOpenUploadPhoto(false);
    setCurrentProductId(-1);
  }

  /**
   * Upload photo
   * @param file - Image
   */
  function uploadPhotoHandler(files: FileList) {
    dispatch(
      uploadProductPhoto(
        currentProductId,
        files[0] as File,
        !!state.newProduct?.id
      )
    );
  }

  /**
   * Render products
   */
  function renderProducts() {
    return props.products.map((item) => (
      <div key={item.product_id}>
        <div>
          <img src={item.photo} width={300} height={300} alt="" />
          <Divider orientation={'vertical'} />
        </div>
        <div>
          <div>
            <div>
              {item.product_id} - {item.title}
            </div>
            <Button
              onClick={() => productHandler(false, item.product_id)}
              disabled={!userState.me?.user?.admin.fullAccess}
            >
              Edit
            </Button>
          </div>
          <div>
            <div>Price - {item.price}</div>
            <div>
              Created -{' '}
              {moment(new Date(+item.created_on).toString()).format('lll')}
            </div>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <Container>
      {/* New/Edit product modal */}
      <Dialog
        open={productModalOpen && !openUploadPhoto}
        onClose={cleanProduct}
      >
        <DialogTitle>
          {currentProductId === -1
            ? 'Add new product'
            : `Edit product - ${productData.title}`}
        </DialogTitle>
        <DialogContent>
          <div>
            <Input
              name="title"
              defaultValue={currentProductId === -1 ? '' : productData.title}
              onChange={(e) =>
                productDataHandler(e.target.name, e.target.value)
              }
              placeholder="Title"
            />
          </div>
          <div>
            <Input
              name="description"
              defaultValue={
                currentProductId === -1 ? '' : productData.description
              }
              onChange={(e) =>
                productDataHandler(e.target.name, e.target.value)
              }
              placeholder="Description"
            />
          </div>
          <div>
            <Input
              name="techspecs"
              defaultValue={
                currentProductId === -1 ? '' : productData.techspecs
              }
              onChange={(e) =>
                productDataHandler(e.target.name, e.target.value)
              }
              placeholder="Tech specs"
            />
          </div>
          <div>
            <span>Price </span>
            <Input
              type="number"
              name="price"
              defaultValue={currentProductId === -1 ? 0 : productData.price}
              onChange={(e) =>
                productDataHandler(e.target.name, e.target.value)
              }
              placeholder="Price"
            />
          </div>
          <div>
            <span>Quantity </span>
            <Input
              type="number"
              name="quantity"
              defaultValue={currentProductId === -1 ? 0 : productData.quantity}
              onChange={(e) =>
                productDataHandler(e.target.name, e.target.value)
              }
              placeholder="Quantity"
            />
          </div>
          <div>
            <span>Subcategory id </span>
            <Input
              type="number"
              name="subcategory_id"
              defaultValue={
                currentProductId === -1 ? 0 : productData.subcategory_id
              }
              onChange={(e) =>
                productDataHandler(e.target.name, e.target.value)
              }
              placeholder="Subcategory id"
            />
          </div>
          <Tags
            selectHandler={productDataHandler}
            selected={productData.tags || []}
          />
        </DialogContent>
        <DialogActions>
          {currentProductId !== -1 && (
            <>
              <Button onClick={submitDelete}>Delete</Button>
              <Button onClick={() => setOpenUploadPhoto(true)}>
                Upload photo
              </Button>
            </>
          )}
          <Button onClick={cleanProduct}>Cancel</Button>
          {currentProductId !== -1 ? (
            <Button onClick={submitEdit}>Submit</Button>
          ) : (
            <Button onClick={submitNew}>Next</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Upload photo modal */}
      <UploadPhotoModal
        isOpen={openUploadPhoto}
        submitHandler={cleanUploadPhoto}
        uploadHandler={(files) => uploadPhotoHandler(files as FileList)}
        imageSrc={state.newProduct?.photo || ''}
      />
      {/* Information */}
      <div>
        <Typography variant="h5">Products</Typography>
        <Button
          onClick={() => productHandler(true)}
          disabled={!userState.me?.user?.admin.fullAccess}
        >
          Add new product
        </Button>
      </div>

      {/* Products */}
      <div>{loading ? <CircularProgress /> : renderProducts()}</div>
      <Pagination
        prev={() => pagination(false)}
        next={() => pagination(true)}
        currentPage={props.page}
        hasMore={props.hasMore}
      />
    </Container>
  );
}

/**
 * Ssr
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userData = checkUser(context.req);
  if (
    typeof userData?.user?.id === 'undefined' ||
    !userData?.user?.admin?.isAdmin
  )
    return { props: { error: 'unauth' } };
  const page = +(context.query.page || 1);
  const pageSize = 5;

  const reduxStore = initializeStore();
  const products = await productModel.getAllProducts(pageSize, page);
  const hasMore = products.length > +pageSize;
  if (hasMore) {
    products.splice(products.length - 1, 1);
  }

  const productsData = products.map((item) => ({
    ...item,
    photo: getPhotoUrl('products', '' + item.product_id),
    created_on: Date.parse('' + item.created_on).toString(),
  }));
  await reduxStore.dispatch(getProducts(productsData));
  return {
    props: {
      products: reduxStore.getState().products.products,
      hasMore,
      page: page,
    },
  };
};

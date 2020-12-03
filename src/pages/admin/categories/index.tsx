/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from '../../../libs/withUser';
import { categoryModel, ICategoryModel } from '../../../models/category';
import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategories,
  getSubcategories,
} from '../../../redux/reducers/categories';
import { initializeStore, RootState } from '../../../redux/store';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  headerTitle: {
    '& > *': {
      marginRight: '10px',
    },
  },
  subcategory: {
    marginLeft: '20px',
    [theme.breakpoints.down('md')]: {
      marginLeft: '0px',
      marginTop: '20px',
    },
  },
}));

interface Props {
  children?: JSX.Element[];
  categories: ICategoryModel[];
}

/**
 * Categories page
 */
export default function Component(props: Props): JSX.Element {
  const classes = useStyles();
  const [categoryEdit, setCategoryEdit] = React.useState(-1);
  const [isCategory, setIsCategory] = React.useState(true);
  const [newCategory, setNewCategory] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState('');
  const [currentCategory, setCurrentCategory] = React.useState(-1);
  const router = useRouter();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.categories);
  const userState = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (
      state?.createLoadingStatus === 'loaded' ||
      state?.deleteLoadingStatus === 'loaded' ||
      state?.editLoadingStatus === 'loaded'
    ) {
      router.reload();
    }
  }, [state]);

  /**
   * Edit category/subcategory handler
   * @param isCategory - Is category or subcategory
   * @param id - Id
   */
  function editHandler(isCategory: boolean, id: number) {
    setCategoryEdit(id);
    setIsCategory(isCategory);

    const data = isCategory ? props.categories : state.subCategories;
    const currentIndex = (data || []).findIndex((item: any) => {
      if (isCategory) return item.category_id === id;
      else return item.subcategory_id === id;
    });
    const value = isCategory
      ? props.categories[currentIndex].title
      : (state.subCategories || [])[currentIndex].title;
    setCurrentValue(value);
  }

  /**
   * Create category/subcategory handler
   * @param isCategory - Is category or subcategory
   */
  function createHandler(isCategory: boolean) {
    setIsCategory(isCategory);
    setNewCategory(true);
  }

  /**
   * Clearn edit data on close
   */
  function cleanHandler() {
    setCategoryEdit(-1);
    setIsCategory(true);
    setCurrentValue('');
    setNewCategory(false);
  }

  /**
   * Submit edit category/subcategory
   */
  function submitEditHandler() {
    if (currentValue !== '') {
      dispatch(editCategory(isCategory, categoryEdit, currentValue));
    }
  }

  /**
   * Create new category/subcategory
   */
  function addCategoryHandler() {
    if (currentValue !== '') {
      if (currentCategory !== -1) {
        dispatch(createCategory(isCategory, currentValue));
      }
      dispatch(createCategory(isCategory, currentValue, currentCategory));
    }
  }

  /**
   * Delete category/subcategory
   */
  function deleteCategoryHandler() {
    dispatch(deleteCategory(isCategory, categoryEdit));
  }

  /**
   * Get subcategories in category
   * @param categoryId - Category id
   */
  function getSubcategoriesHandler(categoryId: number) {
    setCurrentCategory(categoryId);
    dispatch(getSubcategories(categoryId));
  }

  /**
   * Render categories
   */
  function renderCategories() {
    return props.categories.map((item) => (
      <div key={item.category_id}>
        <div className={classes.flexSpaceBetween}>
          <Button onClick={() => getSubcategoriesHandler(item.category_id)}>
            {item.title}
          </Button>
          <Button
            onClick={() => editHandler(true, item.category_id)}
            disabled={!userState.me?.user?.admin.fullAccess}
          >
            Edit
          </Button>
        </div>
        <Divider />
      </div>
    ));
  }
  /**
   * Render subcategories
   */
  function renderSubcategories() {
    return (state.subCategories || []).map((item) => (
      <div key={item.subcategory_id}>
        <Typography variant={'h6'}>{item.title}</Typography>
        <div className={classes.flexSpaceBetween}>
          <span>Id - {item.subcategory_id}</span>
          <Button
            onClick={() => editHandler(false, item.subcategory_id)}
            disabled={!userState?.me?.user?.admin?.fullAccess}
          >
            Edit
          </Button>
        </div>
        <Divider />
      </div>
    ));
  }
  return (
    <Container>
      {/* Edit category/subcategory modal */}
      <Dialog open={categoryEdit !== -1} onClose={cleanHandler}>
        <DialogTitle>
          Edit {isCategory ? 'category' : 'subcategory'}
        </DialogTitle>
        <DialogContent>
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteCategoryHandler}>Delete</Button>
          <div>
            <Button onClick={cleanHandler}>Cancel</Button>
            <Button onClick={submitEditHandler}>Apply</Button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Create category/subcategory modal */}
      <Dialog open={newCategory} onClose={cleanHandler}>
        <DialogTitle>
          Create {isCategory ? 'category' : 'subcategory'}
        </DialogTitle>
        <DialogContent>
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanHandler}>Cancel</Button>
          <Button onClick={addCategoryHandler}>Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Main */}
      <Typography variant={'h5'}>Categories</Typography>
      <div className={classes.content}>
        {/* Categories */}
        <Card>
          <CardContent>
            <div
              className={[classes.flexSpaceBetween, classes.headerTitle].join(
                ' '
              )}
            >
              <Typography variant={'h6'}>Categories</Typography>
              <Button
                onClick={() => createHandler(true)}
                disabled={!userState?.me?.user?.admin?.fullAccess}
              >
                Add new category
              </Button>
            </div>
            {props.categories && renderCategories()}
          </CardContent>
        </Card>
        {/* Subcategories */}
        {state.getSubcategoriesLoadingStatus === 'loaded' ? (
          <Card className={classes.subcategory}>
            <CardContent>
              <div
                className={[classes.flexSpaceBetween, classes.headerTitle].join(
                  ' '
                )}
              >
                <Typography variant={'h6'}>Subcategories</Typography>
                <Button
                  onClick={() => createHandler(false)}
                  disabled={!userState?.me?.user?.admin?.fullAccess}
                >
                  Add new subcategory
                </Button>
              </div>
              {(state.subCategories || [])?.length > 0 && renderSubcategories()}
            </CardContent>
          </Card>
        ) : state.getSubcategoriesLoadingStatus === 'loading' ? (
          <CircularProgress />
        ) : state.getSubcategoriesLoadingStatus === 'error' ? (
          <div>Something went wrong!</div>
        ) : (
          <div></div>
        )}
      </div>
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

  const reduxStore = initializeStore();
  const categories = await categoryModel.getAllCategories();
  const categoriesData = categories.map((item) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));
  await reduxStore.dispatch(getCategories(categoriesData));
  return {
    props: {
      categories: reduxStore.getState().categories.categories,
    },
  };
};

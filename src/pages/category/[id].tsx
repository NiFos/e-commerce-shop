import {
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  makeStyles,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from '../../components/Pagination';
import { ProductLink } from '../../components/ProductLink';
import { categoryModel } from '../../models/category';
import { getProductsInCategory } from '../../redux/reducers/category';
import { RootState } from '../../redux/store';
import { ITag } from '../../components/tags';

const useStyles = makeStyles({
  productsList: {
    display: 'flex',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  filters: {
    display: 'flex',
    '& > *': {
      marginLeft: '20px',
    },
  },
  filtersPerPage: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: '10px',
    },
  },
  tag: {
    cursor: 'pointer',
    display: 'inline-block',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '2px',
    },
  },
});

interface Props {
  children?: JSX.Element[];
  data: {
    subcategoryData: {
      id: number;
      title: string;
    };
    tags: ITag[];
    prices: [number, number];
  };
}

/**
 * Category page
 */
export default function Component(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.category);
  const [perPage, setPerPage] = React.useState(5);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const classes = useStyles();
  const [prices, setPrices] = React.useState<[number, number]>(
    props.data.prices
  );
  const [tags, setTags] = React.useState<number[]>([]);

  React.useEffect(() => {
    getProductsHandler();
  }, []);

  /**
   * Change page size
   * @param value - Page size
   */
  function changePageSize(value: number) {
    setPerPage(value);
    getProductsHandler(undefined, value);
  }

  /**
   * Change page size
   * @param value - Page size
   */
  function selectTag(id: number) {
    if (tags.includes(id)) {
      const newTags = tags.filter((item) => item !== id);
      setTags(newTags);
    } else {
      const newTags = [...tags];
      newTags.push(id);
      setTags(newTags);
    }
  }

  /**
   * Get products
   */
  function getProductsHandler(page?: number, value?: number) {
    dispatch(
      getProductsInCategory(
        props.data.subcategoryData.id,
        prices,
        tags,
        value || perPage || 5,
        page || state?.category?.page || 1
      )
    );
  }

  /**
   * Render products
   */
  function renderProducts() {
    return (state?.category?.products || []).map((item) => {
      return (
        <ProductLink
          title={item.title}
          key={item.product_id}
          price={item.price}
          photo={item.photo || ''}
          productId={item.product_id}
          description={item.description}
        />
      );
    });
  }

  /**
   * Render tags
   */
  function renderTags() {
    return (props.data.tags || []).map((item) => {
      return (
        <div
          onClick={() => selectTag(item.tag_id)}
          key={item.tag_id}
          className={classes.tag}
        >
          <Checkbox
            checked={tags.includes(item.tag_id)}
            onChange={() => selectTag(item.tag_id)}
          />
          {item.title}
        </div>
      );
    });
  }

  return (
    <Container>
      <div className={classes.header}>
        <Typography variant={'h5'}>
          {props.data.subcategoryData.title}
        </Typography>
        <div className={classes.filters}>
          <div className={classes.filtersPerPage}>
            <Typography variant={'subtitle1'}>Products per page </Typography>
            <Select
              value={perPage}
              onChange={(e) => changePageSize(e.target.value as number)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </div>
          <Button onClick={() => setFiltersOpen(!filtersOpen)}>
            <FilterListIcon />
            {filtersOpen ? 'Close filters' : 'Filters'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <Card>
          <CardContent>
            <Typography variant={'h6'}>Tags</Typography>
            <div>{renderTags()}</div>
            <div>
              <div>
                <div>
                  <Typography variant={'h6'}>Prices</Typography>
                  <Slider
                    valueLabelDisplay="auto"
                    value={prices}
                    disabled={props.data.prices[0] === props.data.prices[1]}
                    min={props.data.prices[0]}
                    max={props.data.prices[1]}
                    onChange={(e, newValue) =>
                      setPrices(newValue as [number, number])
                    }
                  />
                </div>
              </div>
              <Button onClick={() => getProductsHandler()}>
                Apply filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Products list */}
      <div>
        {state.getProductsLoadingStatus === 'loaded' ? (
          <div className={classes.productsList}>
            {state?.category?.products && renderProducts()}
          </div>
        ) : state.getProductsLoadingStatus === 'loading' ? (
          <CircularProgress />
        ) : state.getProductsLoadingStatus === 'error' ? (
          <div>Something went wrong!</div>
        ) : (
          <div></div>
        )}

        <Pagination
          currentPage={state.category?.page || 1}
          hasMore={state.category?.hasMore || false}
          next={() =>
            getProductsHandler(
              state?.category?.page && state?.category?.page + 1
            )
          }
          prev={() =>
            getProductsHandler(
              state?.category?.page && state?.category?.page - 1
            )
          }
        />
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const subcategories = await categoryModel.getAllSubcategories();

  const paths = subcategories.map((item) => ({
    params: { id: '' + item.subcategory_id },
  }));
  return { paths, fallback: false };
};

/**
 * Ssr
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const id = +(context?.params?.id || 0);
  const subcategory = await categoryModel.getSubcategory(id);
  const subcategoryData = await categoryModel.getSubcategoryData(id);

  return {
    props: {
      data: {
        subcategoryData: {
          id: subcategory[0]?.subcategory_id,
          title: subcategory[0]?.title,
        },
        tags: subcategoryData?.tags,
        prices: subcategoryData?.prices,
      },
    },
  };
};

import {
  Container,
  Divider,
  Link,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { categoryModel } from '../../models/category';
import { getProductsInCategory } from '../../redux/reducers/category';
import { RootState } from '../../redux/store';

interface Props {
  children?: any;
  data: {
    subcategoryData: {
      id: number;
      title: string;
    };
    tags: any[];
    prices: [number, number];
  };
}

/**
 * Category page
 */
export default function Component(props: Props) {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.category);
  const [perPage, setPerPage] = React.useState(5);
  const [prices, setPrices] = React.useState<[number, number]>(
    props.data.prices
  );

  React.useEffect(() => {
    getProductsHandler();
  }, []);

  /**
   * Change page size
   * @param value - Page size
   */
  function changePageSize(value: number) {
    setPerPage(value);
    getProductsHandler();
  }

  /**
   * Get products
   */
  function getProductsHandler() {
    dispatch(
      getProductsInCategory(
        props.data.subcategoryData.id,
        prices,
        perPage,
        /* state?.products[state.products.length - 1]?.product_id || */ 0
      )
    );
  }

  /**
   * Render products
   */
  function renderProducts() {
    return state.products.map((item: any) => {
      return (
        <Link href={`/product/${item.product_id}`} key={item.product_id}>
          <img width={300} height={300} src={item.photo} alt="" />
          <Divider orientation={'vertical'} />
          <div>
            <div>
              <div>{item.title}</div>
              <div>{item.price}</div>
            </div>
            <div>{item.description}</div>
          </div>
        </Link>
      );
    });
  }

  return (
    <Container>
      <Typography variant={'h5'}>{props.data.subcategoryData.title}</Typography>
      <div>Tags</div>
      <div>
        <div>
          <div>
            <Typography>Prices</Typography>
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
        <div>
          <div>
            <span>Products per page</span>
            <Select
              value={perPage}
              onChange={(e) => changePageSize(e.target.value as number)}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </div>
          <div>{state.products && renderProducts()}</div>
        </div>
      </div>
    </Container>
  );
}

/**
 * Ssr
 */
export async function getStaticPaths() {
  const subcategories = await categoryModel.getAllSubcategories();

  const paths = subcategories.map((item: any) => ({
    params: { id: '' + item.subcategory_id },
  }));
  return { paths, fallback: false };
}

/**
 * Ssr
 */
export async function getStaticProps(context: any) {
  const id = context.params.id;
  const subcategory = await categoryModel.getSubcategory(+id);
  const subcategoryData = await categoryModel.getSubcategoryData(+id);

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
}

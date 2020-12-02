import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  Link,
  makeStyles,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProducts } from '../../../redux/reducers/search';
import { RootState } from '../../../redux/store';

const useStyles = makeStyles({
  list: {
    marginTop: '5px',
  },
  item: {
    paddingBottom: '3px',
  },
  results: {
    marginBottom: '5px',
  },
});

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Search modal
 */
export function Search(props: Props): JSX.Element {
  const [value, setValue] = React.useState('');
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.search);
  const classes = useStyles();

  /**
   * Render products
   */
  function renderProducts() {
    return (state.products || []).map((item) => {
      return (
        <Link
          href={`/product/${item.product_id}`}
          key={item.product_id}
          className={classes.item}
        >
          <div>{item.title}</div>
          <Divider />
        </Link>
      );
    });
  }
  /**
   * Render products
   */
  function searchHandler(e?: React.FormEvent) {
    e?.preventDefault();
    dispatch(searchProducts(value));
  }
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Search</DialogTitle>
      <DialogContent dividers>
        <div>
          <form onSubmit={searchHandler}>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter product name"
            />
            <Button onClick={searchHandler}>Search</Button>
          </form>
        </div>
        {state.searchProductsLoadingStatus === 'loaded' ? (
          <div className={classes.list}>
            <div className={classes.results}>Results</div>
            {renderProducts()}
          </div>
        ) : state.searchProductsLoadingStatus === 'loading' ? (
          <CircularProgress />
        ) : state.searchProductsLoadingStatus === 'error' ? (
          <div>Something went wrong!</div>
        ) : (
          <div></div>
        )}
      </DialogContent>
    </Dialog>
  );
}

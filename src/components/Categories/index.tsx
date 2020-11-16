import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicCategories } from '../../redux/reducers/categories';
import { RootState } from '../../redux/store';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Categories component
 */
export function Categories(props: Props) {
  const state = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch();
  const router = useRouter();

  React.useEffect(() => {
    dispatch(getPublicCategories());
  }, []);

  /**
   * Render categories
   */
  function renderCategories() {
    return state.publicCategories.map((item: any) => {
      return (
        <Accordion key={item.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={'h6'}>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderSubcategories(item.subcategories)}
          </AccordionDetails>
        </Accordion>
      );
    });
  }

  /**
   * Render subcategories
   */
  function renderSubcategories(subcategories: any[]) {
    return subcategories.map((item: any) => {
      return (
        <ButtonGroup key={item.id}>
          <Button
            onClick={() => router.push(`/category/${item.id}`)}
            key={item.id}
          >
            {item.title}
          </Button>
        </ButtonGroup>
      );
    });
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Catalog</DialogTitle>
      {state.getPublicCategoriesLoadingStatus === 'loaded' ? (
        <DialogContent dividers>
          {state.publicCategories && renderCategories()}
        </DialogContent>
      ) : state.getPublicCategoriesLoadingStatus === 'error' ? (
        <div>Something went wrong</div>
      ) : (
        state.getPublicCategoriesLoadingStatus === 'loading' && (
          <CircularProgress />
        )
      )}
    </Dialog>
  );
}

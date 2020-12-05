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
import { getPublicCategories } from '../../../redux/reducers/categories';
import { RootState } from '../../../redux/store';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import i18n from '../../../../i18n';

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Categories component
 */
export function Categories(props: Props): JSX.Element {
  const state = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch();
  const { t } = i18n.useTranslation();
  const router = useRouter();

  React.useEffect(() => {
    dispatch(getPublicCategories());
  }, []);

  /**
   * Render categories
   */
  function renderCategories() {
    return (state.publicCategories || []).map((item) => {
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
   * Click subcategory handler
   * @param id - Category id
   */
  function clickHandler(id: number) {
    router.push(`/category/${id}`);
    props.onClose();
  }

  /**
   * Render subcategories
   */
  function renderSubcategories(subcategories: { title: string; id: number }[]) {
    return subcategories.map((item) => {
      return (
        <ButtonGroup key={item.id}>
          <Button onClick={() => clickHandler(item.id)} key={item.id}>
            {item.title}
          </Button>
        </ButtonGroup>
      );
    });
  }

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>{t('catalog')}</DialogTitle>
      {state.getPublicCategoriesLoadingStatus === 'loaded' ? (
        <DialogContent dividers>
          {state.publicCategories && renderCategories()}
        </DialogContent>
      ) : state.getPublicCategoriesLoadingStatus === 'error' ? (
        <div>{t('error')}</div>
      ) : (
        state.getPublicCategoriesLoadingStatus === 'loading' && (
          <CircularProgress />
        )
      )}
    </Dialog>
  );
}

import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../../../../i18n';
import { UploadPhotoModal } from '../../../components/Modals/uploadPhoto';
import { getPhotoUrl } from '../../../libs/storage';
import { checkUser } from '../../../libs/withUser';
import { discountModel, IDiscountModel } from '../../../models/discount';
import {
  createDiscount,
  deleteDiscount,
  editDiscount,
  getDiscounts,
  uploadDiscountPhoto,
} from '../../../redux/reducers/discounts';
import { initializeStore, RootState } from '../../../redux/store';

const useStyles = makeStyles((theme) => ({
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  discount: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  discountInfo: {
    width: '70%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      marginLeft: '20px',
    },
  },
  headerTitle: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  content: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  img: {
    '& > *': {
      height: 'auto',
      width: '100%',
      maxWidth: '300px',
      objectFit: 'cover',
    },
  },
}));

interface Props {
  children?: JSX.Element[];
  discounts: IDiscountModel[];
}

interface IDiscountData {
  title?: string;
  description?: string;
  to?: string;
  percentage?: number;
  promocode?: string;
  products?: number[];
}

/**
 * Discounts page
 */
export default function Component(props: Props): JSX.Element {
  const classes = useStyles();
  const { t } = i18n.useTranslation();
  const state = useSelector((state: RootState) => state.discounts);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [newDiscountOpen, setNewDiscountOpen] = React.useState(false);
  const [discountData, setDiscountData] = React.useState<IDiscountData>({});
  const [currentDiscountId, setCurrentDiscountId] = React.useState(-1);
  const [openUploadPhoto, setOpenUploadPhoto] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (
      state.deleteLoadingStatus === 'loaded' ||
      state.uploadPhotoLoadingStatus === 'loaded' ||
      state.editLoadingStatus === 'loaded'
    ) {
      router.reload();
    }
    if (state.createLoadingStatus === 'loaded') {
      cleanNewDiscount();
      setCurrentDiscountId(state.newDiscount?.id || -1);
      setOpenUploadPhoto(true);
    }
  }, [state]);

  /**
   * Change discount data values
   * @param name - Name of property
   * @param value - Value
   */
  function discountDataHandler(name: string, value?: string) {
    const data = {
      ...discountData,
      [name]: value,
    };
    setDiscountData(data);
  }

  /**
   * Open new discount modal
   */
  function addNewDiscountHandler() {
    setNewDiscountOpen(true);
  }

  /**
   * Open edit discount modal
   */
  function editDiscountHandler(id: number) {
    setCurrentDiscountId(id);
    setDiscountData({
      title: props.discounts[0].title,
      description: props.discounts[0].description,
    });
  }

  /**
   * Clean new discount data and close modal
   */
  function cleanNewDiscount() {
    setNewDiscountOpen(false);
    setDiscountData({});
  }

  /**
   * Clean new discount data and close modal
   */
  function cleanEditDiscount() {
    setCurrentDiscountId(-1);
    setDiscountData({});
  }

  /**
   * Clean upload photo data and close modal
   */
  function cleanUploadPhoto() {
    setNewDiscountOpen(false);
    setOpenUploadPhoto(false);
    setCurrentDiscountId(-1);
  }

  /**
   * Upload photo
   * @param file - Image
   */
  function uploadPhotoHandler(files: FileList) {
    dispatch(
      uploadDiscountPhoto(currentDiscountId, files[0], !!state.newDiscount?.id)
    );
  }

  /**
   * Delete discount
   */
  function deleteDiscountHandler() {
    dispatch(deleteDiscount(currentDiscountId));
  }

  /**
   * Submit new discount
   */
  function submitNew() {
    if (
      typeof discountData.title !== 'undefined' &&
      typeof discountData.description !== 'undefined' &&
      typeof discountData.to !== 'undefined' &&
      typeof discountData.percentage !== 'undefined' &&
      typeof discountData.promocode !== 'undefined'
    )
      dispatch(
        createDiscount(
          discountData.title,
          discountData.description,
          discountData.to,
          discountData.percentage,
          discountData.promocode
        )
      );
  }

  /**
   * Submit edit discount
   */
  function submitEdit() {
    if (
      typeof discountData.title !== 'undefined' ||
      typeof discountData.description !== 'undefined'
    ) {
      dispatch(
        editDiscount(
          currentDiscountId,
          discountData.title,
          discountData.description
        )
      );
    }
  }

  /**
   * Render discounts
   */
  function renderDiscounts() {
    return props.discounts.map((item) => (
      <Card key={item.discount_id} className={classes.content}>
        <CardContent className={classes.discount}>
          <div className={classes.img}>
            <img src={item.photo} alt="Photo" />
          </div>
          <div className={classes.discountInfo}>
            <div className={classes.flexSpaceBetween}>
              <Typography>{item.title}</Typography>
              <Button onClick={() => editDiscountHandler(item.discount_id)}>
                {t('admin:edit')}
              </Button>
            </div>
            <Typography>{item.description}</Typography>
            <div>
              <Typography>
                {t('admin:discounts.to')}: {moment(item.date_to).format('lll')}
              </Typography>
              <Typography>
                {t('admin:discounts.created')}:{' '}
                {moment(item.created_on).format('lll')}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  }

  return (
    <Container>
      {/* New discount modal */}
      <Dialog open={newDiscountOpen} onClose={cleanNewDiscount}>
        <DialogTitle>{t('admin:discounts.add-new-discount')}</DialogTitle>
        <DialogContent>
          <div>
            <Input
              name="title"
              value={discountData.title}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              placeholder={t('admin:discounts.title')}
            />
          </div>
          <div>
            <Input
              name="description"
              value={discountData.description}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              placeholder={t('admin:discounts.description')}
            />
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              format="dd/MM/yyyy"
              label={t('admin:discounts.date-to')}
              value={discountData.to}
              onChange={(value) =>
                discountDataHandler('to', value?.toDateString())
              }
            />
            <KeyboardTimePicker
              label={t('admin:discounts.time-to')}
              value={discountData.to}
              onChange={(value) =>
                discountDataHandler('to', value?.toDateString())
              }
            />
          </MuiPickersUtilsProvider>
          <div>
            <Input
              type="number"
              name="percentage"
              value={discountData.percentage}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              placeholder={t('admin:discounts.percentage')}
            />{' '}
            <span>%</span>
          </div>
          <div>
            <Input
              name="promocode"
              value={discountData.promocode?.toUpperCase()}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              placeholder={t('admin:discounts.promocode')}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanNewDiscount}>{t('admin:cancel')}</Button>
          <Button onClick={submitNew}>{t('admin:next')}</Button>
        </DialogActions>
      </Dialog>

      {/* Upload photo modal */}
      <UploadPhotoModal
        isOpen={openUploadPhoto}
        submitHandler={cleanUploadPhoto}
        uploadHandler={(files) => uploadPhotoHandler(files as FileList)}
        imageSrc={state.newDiscount?.photo || ''}
      />

      {/* Edit discount modal */}
      <Dialog
        open={currentDiscountId !== -1 && !openUploadPhoto}
        onClose={cleanEditDiscount}
      >
        <DialogTitle>{t('admin:discounts.edit-discount')}</DialogTitle>
        <DialogContent>
          <div>
            <span>{t('admin:discounts.title')} </span>
            <Input
              value={discountData.title}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              name={'title'}
              placeholder="Title"
            />
          </div>
          <div>
            <span>{t('admin:discounts.description')} </span>
            <Input
              value={discountData.description}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              name={'description'}
              placeholder="Description"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDiscountHandler}>{t('admin:remove')}</Button>
          <Button onClick={() => setOpenUploadPhoto(true)}>
            {t('admin:products-page.upload-photo')}
          </Button>
          <Button onClick={cleanEditDiscount}>{t('admin:cancel')}</Button>
          <Button onClick={submitEdit}>{t('admin:submit')}</Button>
        </DialogActions>
      </Dialog>
      {/* Information */}
      <Typography variant={'h6'} className={classes.headerTitle}>
        {t('admin:discounts.discounts')}
      </Typography>
      <Card className={classes.content}>
        <CardContent className={classes.flexSpaceBetween}>
          <div>
            {t('admin:discounts.total-discounts', {
              value: props.discounts.length,
            })}
          </div>
          <Button
            onClick={addNewDiscountHandler}
            disabled={!userState.me?.user?.admin.fullAccess}
          >
            {t('admin:discounts.add-new-discount')}
          </Button>
        </CardContent>
      </Card>
      <div>{renderDiscounts()}</div>
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
  const discounts = await discountModel.getAllDiscounts();
  const discountsData = discounts.map((item) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
    date_to: new Date(item.date_to).toString(),
    photo: getPhotoUrl('discounts', '' + item.discount_id),
  }));
  await reduxStore.dispatch(getDiscounts(discountsData));
  return {
    props: {
      discounts: reduxStore.getState().discounts.discounts,
    },
  };
};

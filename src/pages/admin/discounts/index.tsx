import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UploadPhotoModal } from '../../../components/Modals/uploadPhoto';
import { getPhotoUrl } from '../../../libs/storage';
import { checkUser } from '../../../libs/withUser';
import { discountModel } from '../../../models/discount';
import {
  createDiscount,
  deleteDiscount,
  editDiscount,
  getDiscounts,
  uploadDiscountPhoto,
} from '../../../redux/reducers/discounts';
import { initializeStore, RootState } from '../../../redux/store';

interface Props {
  children?: any;
  discounts: any[];
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
export default function Component(props: Props) {
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
  function discountDataHandler(name: string, value: string) {
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
  function uploadPhotoHandler(file: any) {
    dispatch(
      uploadDiscountPhoto(currentDiscountId, file[0], !!state.newDiscount?.id)
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
      <div key={item.discount_id}>
        <img src={item.photo} width={300} height={300} alt="Photo" />
        <Divider orientation="vertical" />
        <div>
          <div>{item.title}</div>
          <Button onClick={() => editDiscountHandler(item.discount_id)}>
            Edit
          </Button>
        </div>
        <div>{item.description}</div>
        <div>
          <div>To: {moment(item.date_to).format('lll')}</div>
          <div>Created: {moment(item.created_on).format('lll')}</div>
        </div>
      </div>
    ));
  }

  return (
    <Container>
      {/* New discount modal */}
      <Dialog open={newDiscountOpen} onClose={cleanNewDiscount}>
        <DialogTitle>Add new discount</DialogTitle>
        <DialogContent>
          <div>
            <Input
              name="title"
              value={discountData.title}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              placeholder="Title"
            />
          </div>
          <div>
            <Input
              name="description"
              value={discountData.description}
              onChange={(e) =>
                discountDataHandler(e.target.name, e.target.value)
              }
              placeholder="Description"
            />
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              variant="inline"
              format="dd/MM/yyyy"
              label="Date to"
              value={discountData.to}
              onChange={(value: any) => discountDataHandler('to', value)}
            />
            <KeyboardTimePicker
              label="Time to"
              value={discountData.to}
              onChange={(value: any) => discountDataHandler('to', value)}
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
              placeholder="Percentage"
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
              placeholder="Promocode"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={cleanNewDiscount}>Cancel</Button>
          <Button onClick={submitNew}>Next</Button>
        </DialogActions>
      </Dialog>

      {/* Upload photo modal */}
      <UploadPhotoModal
        isOpen={openUploadPhoto}
        submitHandler={cleanUploadPhoto}
        uploadHandler={uploadPhotoHandler}
        imageSrc={state.newDiscount?.photo}
      />

      {/* Edit discount modal */}
      <Dialog
        open={currentDiscountId !== -1 && !openUploadPhoto}
        onClose={cleanEditDiscount}
      >
        <DialogTitle>Edit discount</DialogTitle>
        <DialogContent>
          <Input
            value={discountData.title}
            onChange={(e) => discountDataHandler(e.target.name, e.target.value)}
            name={'title'}
            placeholder="Title"
          />
          <Input
            value={discountData.description}
            onChange={(e) => discountDataHandler(e.target.name, e.target.value)}
            name={'description'}
            placeholder="Description"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDiscountHandler}>Delete</Button>
          <Button onClick={() => setOpenUploadPhoto(true)}>Upload photo</Button>
          <Button onClick={cleanEditDiscount}>Cancel</Button>
          <Button onClick={submitEdit}>Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Information */}
      <div>
        <div>Total discounts - {props.discounts.length}</div>
        <Button
          onClick={addNewDiscountHandler}
          disabled={!userState.me?.user?.admin.fullAccess}
        >
          Add new discount
        </Button>
      </div>
      <div>{renderDiscounts()}</div>
    </Container>
  );
}

/**
 * Ssr
 */
export async function getServerSideProps(context: any) {
  const userData = checkUser(context.req);
  if (
    typeof userData?.user?.id === 'undefined' ||
    !userData?.user?.admin?.isAdmin
  )
    return { props: { error: 'unauth' } };

  const reduxStore = initializeStore({});
  const discounts = await discountModel.getAllDiscounts();
  const discountsData = discounts.map((item: any) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
    date_to: new Date(item.date_to).toString(),
    photo: getPhotoUrl('discounts', item.discount_id),
  }));
  await reduxStore.dispatch(getDiscounts(discountsData));
  return {
    props: {
      discounts: reduxStore.getState().discounts.discounts,
    },
  };
}

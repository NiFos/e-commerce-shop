import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Input,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from '../../../../i18n';
import { checkUser } from '../../../libs/withUser';
import { adminModel, IAdmin } from '../../../models/admin';
import {
  addAdmin,
  deleteAdmin,
  editAdmin,
  getAdmins,
  searchUsers,
} from '../../../redux/reducers/admins';
import { initializeStore, RootState } from '../../../redux/store';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',

    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      '& > *': {
        marginBottom: '20px',
      },
    },
  },
  headerTitle: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  flexSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  adminsListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    marginBottom: '10px',
    '& > *': {
      width: '33.3%',
      textAlign: 'left',
    },
  },
  adminsInfo: {
    width: '75%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}));

interface Props {
  children?: JSX.Element[];
  admins: IAdmin[];
}

/**
 * Admins page
 */
export default function Component(props: Props): JSX.Element {
  const classes = useStyles();
  const { t } = i18n.useTranslation(['admin']);
  const state = useSelector((state: RootState) => state.admins);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState('');
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [fullAccess, setfullAccess] = React.useState(false);
  const [currentAdmin, setCurrentAdmin] = React.useState(-1);
  const [currentAdminAccess, setCurrentAdminAccess] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (
      state.addLoadingStatus === 'loaded' ||
      state.editLoadingStatus === 'loaded' ||
      state.deleteLoadingStatus === 'loaded'
    ) {
      router.reload();
    }
  }, [state]);

  /**
   * Open new admin modal
   */
  function addNewHandler() {
    setNewOpen(true);
  }
  /**
   * Open edit admin modal
   */
  function editHandler(id: number, accessLevel: boolean) {
    setEditOpen(true);
    setCurrentAdmin(id);
    setCurrentAdminAccess(accessLevel);
  }

  /**
   * Clean search data and close new modal
   */
  function cleanNew() {
    setNewOpen(false);
    setSearch('');
  }

  /**
   * Clean admin level and close edit modal
   */
  function cleanEdit() {
    setEditOpen(false);
    setCurrentAdmin(-1);
    setCurrentAdminAccess(false);
  }

  /**
   * Search users by username
   */
  function searchHandler() {
    dispatch(searchUsers(search));
  }

  /**
   * Add new Admin
   * @param userId - User id
   */
  function submitNewAdmin(userId: number) {
    dispatch(addAdmin(userId, fullAccess));
  }

  /**
   * Edit Admin access level
   */
  function submitEditAdminHandler() {
    dispatch(editAdmin(currentAdmin, !!currentAdminAccess));
  }

  /**
   * Delete admin
   */
  function deleteAdminHandler() {
    dispatch(deleteAdmin(currentAdmin));
  }

  /**
   * Render users from search
   */
  function renderUsers() {
    return (
      state?.search &&
      state?.search.map((searchUser) => {
        const isAlreadyAdmin = props.admins.findIndex(
          (admin) => admin.user_id === searchUser.user_id
        );
        return (
          <div key={searchUser.user_id}>
            <span>{searchUser.username}</span>
            <Button
              disabled={isAlreadyAdmin !== -1}
              onClick={() => submitNewAdmin(searchUser.user_id)}
            >
              {t('admin:admins.add-with', {
                context: fullAccess ? 'full' : 'view',
              })}
            </Button>
          </div>
        );
      })
    );
  }

  /**
   * Render admin list
   */
  function renderAdmins() {
    return (
      props.admins &&
      props.admins.map((item) => {
        return (
          <Card key={item.user_id}>
            <CardContent className={classes.flexSpaceBetween}>
              <div>{item.username}</div>
              <div>
                {item.full_access
                  ? t('admin:admins.full-access')
                  : t('admin:admins.view-access')}
              </div>
              <Button
                onClick={() => editHandler(item.user_id, item.full_access)}
                disabled={!userState?.me?.user?.admin?.fullAccess}
              >
                {t('admin:edit')}
              </Button>
            </CardContent>
          </Card>
        );
      })
    );
  }

  return (
    <Container>
      {/* New admin modal */}
      <Dialog open={newOpen} onClose={cleanNew}>
        <DialogTitle>{t('admin:admins.add-new-admin')}</DialogTitle>
        <DialogContent>
          <div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter username"
            />
            <Button onClick={searchHandler}>{t('admin:search')}</Button>
          </div>
          <div>
            <div>
              <div>{t('admin:search')}</div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fullAccess}
                    onChange={() => setfullAccess(!fullAccess)}
                    name="fullAccess"
                  />
                }
                label={t('admin:admins.full-access')}
              />
            </div>
            <div>
              {state.searchLoadingStatus === 'loaded' ? (
                renderUsers()
              ) : state.searchLoadingStatus === 'loading' ? (
                <CircularProgress />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit admin modal */}
      <Dialog open={editOpen} onClose={cleanEdit}>
        <DialogTitle>
          {t('admin:admins.edit-admin')} - {currentAdmin}
        </DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentAdminAccess}
                onChange={() => setCurrentAdminAccess(!fullAccess)}
                name="fullAccess"
              />
            }
            label="Set full access"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteAdminHandler}>{t('admin:remove')}</Button>
          <Button onClick={cleanEdit}>{t('admin:cancel')}</Button>
          <Button onClick={submitEditAdminHandler}>{t('admin:submit')}</Button>
        </DialogActions>
      </Dialog>
      {/* Information */}
      <Typography variant={'h6'} className={classes.headerTitle}>
        {t('admin:admins.admins')}
      </Typography>
      <div className={classes.header}>
        {/* Your access level */}
        <Card>
          <CardContent>
            <Typography>
              Your access:{' '}
              {userState.me?.user?.admin.fullAccess
                ? t('admin:admins.full-access')
                : t('admin:admins.view-access')}
            </Typography>
          </CardContent>
        </Card>

        {/* All admins information */}
        <Card className={classes.adminsInfo}>
          <CardContent className={classes.header}>
            <Typography>Total admins: {props.admins.length}</Typography>
            <Typography>
              {t('admin:admins.admins-with-full')}:{' '}
              {props.admins.filter((item) => item.full_access).length}
            </Typography>
            <Typography>
              {t('admin:admins.admins-with-view')}:{' '}
              {props.admins.filter((item) => !item.full_access).length}
            </Typography>
            <Button
              onClick={addNewHandler}
              disabled={!userState?.me?.user?.admin?.fullAccess}
            >
              {t('admin:admins.add-new-admin')}
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Admin list */}
      <div>
        {/* Table header */}
        <div className={classes.adminsListHeader}>
          <div>{t('admin:admins.username')}</div>
          <div>{t('admin:admins.access-level')}</div>
          <div></div>
        </div>
        {/* List */}
        <div>{props.admins && renderAdmins()}</div>
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
  const admins = await adminModel.getAllAdmins();
  const adminsData = admins.map((item) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));
  await reduxStore.dispatch(getAdmins(adminsData));

  return {
    props: {
      admins: reduxStore.getState().admins.admins,
    },
  };
};

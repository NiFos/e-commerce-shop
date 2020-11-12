import {
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Input,
  MenuItem,
  Select,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from '../../../libs/withUser';
import { adminModel } from '../../../models/admin';
import {
  addAdmin,
  deleteAdmin,
  editAdmin,
  getAdmins,
  searchUsers,
} from '../../../redux/reducers/admins';
import { initializeStore, RootState } from '../../../redux/store';

interface Props {
  children?: any;
  admins: any[];
}

/**
 * Admins page
 */
export default function Component(props: Props) {
  const state = useSelector((state: RootState) => state.admins);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState('');
  const [newOpen, setNewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [fullAccess, setFullaccess] = React.useState(false);
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
      state?.search.map((searchUser: any) => {
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
              Add with {fullAccess ? 'full access' : 'view access'}
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
          <div key={item.user_id}>
            <div>{item.username}</div>
            <div>{item.full_access ? 'Full access' : 'View access'}</div>
            <Button
              onClick={() => editHandler(item.user_id, item.full_access)}
              disabled={!userState?.me?.user?.admin?.fullAccess}
            >
              Edit
            </Button>
          </div>
        );
      })
    );
  }

  return (
    <Container>
      {/* New admin modal */}
      <Dialog open={newOpen} onClose={cleanNew}>
        <DialogTitle>Add new admin</DialogTitle>
        <DialogContent>
          <div>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter username"
            />
            <Button onClick={searchHandler}>Search</Button>
          </div>
          <div>
            <div>
              <div>Search</div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fullAccess}
                    onChange={() => setFullaccess(!fullAccess)}
                    name="fullAccess"
                  />
                }
                label="Set full access"
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
        <DialogTitle>Edit admin - {currentAdmin}</DialogTitle>
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
          <Button onClick={deleteAdminHandler}>Delete</Button>
          <Button onClick={cleanEdit}>Cancel</Button>
          <Button onClick={submitEditAdminHandler}>Submit</Button>
        </DialogActions>
      </Dialog>
      {/* Information */}
      <div>
        {/* Your access level */}
        <div>
          Your access:{' '}
          {userState.me?.user?.admin.fullAccess ? 'Full access' : 'View access'}
        </div>

        {/* All admins information */}
        <div>
          <div>Total admins: {props.admins.length}</div>
          <div>
            Admins with full access:{' '}
            {props.admins.filter((item: any) => item.full_access).length}
          </div>
          <div>
            Admins with view access:{' '}
            {props.admins.filter((item: any) => !item.full_access).length}
          </div>
          <Button
            onClick={addNewHandler}
            disabled={!userState?.me?.user?.admin?.fullAccess}
          >
            Add new admin
          </Button>
        </div>
      </div>
      {/* Admin list */}
      <div>
        {/* Table header */}
        <div>
          <div>Username</div>
          <div>Access level</div>
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
export async function getServerSideProps(context: any) {
  const userData = checkUser(context.req);
  if (
    typeof userData?.user?.id === 'undefined' ||
    !userData?.user?.admin?.isAdmin
  )
    return { props: { error: 'unauth' } };

  const reduxStore = initializeStore({});
  const admins = await adminModel.getAllAdmins();
  const adminsData = admins.map((item: any) => ({
    ...item,
    created_on: new Date(item.created_on).toString(),
  }));
  await reduxStore.dispatch(getAdmins(adminsData));

  return {
    props: {
      admins: reduxStore.getState().admins.admins,
    },
  };
}

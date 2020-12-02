import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage } from '../../redux/reducers/settings';
import { editUserInfo } from '../../redux/reducers/user';
import { RootState } from '../../redux/store';

const useStyles = makeStyles({
  property: {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

interface Props {
  phone: string;
  deliveryAddress: string;
}

interface IUserData {
  phone?: string;
  deliveryAddress?: string;
}

/**
 * Settings component
 */
export function Settings(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const classes = useStyles();
  const settingsState = useSelector((state: RootState) => state.settings);
  const [userInfoOpen, setUserInfoOpen] = React.useState(false);
  const [userData, setUserData] = React.useState<IUserData>({});

  /**
   * Edit userData
   * @param name - Name of property
   * @param value - Value
   */
  function handleFormEdit(name: string, value: string) {
    setUserData({
      ...userData,
      [name]: value,
    });
  }

  /**
   * Handle close user info modal
   */
  function handleClose() {
    setUserInfoOpen(!userInfoOpen);
  }

  /**
   * Submit user edit
   */
  function submitEdit() {
    dispatch(editUserInfo(userData.phone, userData.deliveryAddress));
  }

  return (
    <Card>
      <CardContent>
        <Dialog open={userInfoOpen} onClose={handleClose}>
          <DialogTitle>Edit user information</DialogTitle>
          <DialogContent>
            <div className={classes.property}>
              <span>Phone</span>
              <Input
                name="phone"
                defaultValue={props.phone}
                placeholder="Phone"
                fullWidth
                onChange={(e) => handleFormEdit(e.target.name, e.target.value)}
              />
            </div>
            <div className={classes.property}>
              <span>Delivery address</span>
              <Input
                name="deliveryAddress"
                fullWidth
                defaultValue={props.deliveryAddress}
                placeholder="Delivery address"
                onChange={(e) => handleFormEdit(e.target.name, e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={submitEdit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <div>
          <Typography variant={'h6'}>Settings</Typography>
          <div className={classes.property}>
            <span>Language</span>
            <Select
              value={settingsState.language}
              onChange={(e) =>
                dispatch(changeLanguage(e.target.value as 'ru' | 'en'))
              }
            >
              <MenuItem value="ru">RU</MenuItem>
              <MenuItem value="en">EN</MenuItem>
            </Select>
          </div>
          <Divider />
        </div>
        <div className={classes.property}>
          <span>User information</span>
          <Button onClick={() => setUserInfoOpen(true)}>Edit</Button>
        </div>
        <Divider />
      </CardContent>
    </Card>
  );
}

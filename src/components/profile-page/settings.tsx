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
import { useDispatch } from 'react-redux';
import i18n from '../../../i18n';
import translation from '../../../i18n';
import { editUserInfo } from '../../redux/reducers/user';

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
  const { t } = i18n.useTranslation();
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
          <DialogTitle>{t('profile-page.edit-user-information')}</DialogTitle>
          <DialogContent>
            <div className={classes.property}>
              <span>{t('profile-page.phone')}</span>
              <Input
                name="phone"
                defaultValue={props.phone}
                placeholder={t('profile-page.phone')}
                fullWidth
                onChange={(e) => handleFormEdit(e.target.name, e.target.value)}
              />
            </div>
            <div className={classes.property}>
              <span>{t('profile-page.delivery-address')}</span>
              <Input
                name="deliveryAddress"
                fullWidth
                defaultValue={props.deliveryAddress}
                placeholder={t('profile-page.delivery-address')}
                onChange={(e) => handleFormEdit(e.target.name, e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{t('cancel')}</Button>
            <Button onClick={submitEdit}>{t('submit')}</Button>
          </DialogActions>
        </Dialog>
        <div>
          <Typography variant={'h6'}>{t('settings.settings')}</Typography>
          <div className={classes.property}>
            <span>{t('settings.language')}</span>
            <Select
              value={translation.i18n.language}
              onChange={(e) =>
                translation.i18n.changeLanguage(e.target.value as 'ru' | 'en')
              }
            >
              <MenuItem value="ru">RU</MenuItem>
              <MenuItem value="en">EN</MenuItem>
            </Select>
          </div>
          <Divider />
        </div>
        <div className={classes.property}>
          <span>{t('profile-page.user-information')}</span>
          <Button onClick={() => setUserInfoOpen(true)}>{t('edit')}</Button>
        </div>
        <Divider />
      </CardContent>
    </Card>
  );
}
